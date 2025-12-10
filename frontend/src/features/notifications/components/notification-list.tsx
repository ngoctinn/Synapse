"use client";

import { Notification } from "../model/types";
import { NotificationItem } from "./notification-item";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { format, isToday, isYesterday } from "date-fns";
import { vi } from "date-fns/locale";

interface NotificationListProps {
  notifications: Notification[];
  onItemClick?: (id: string) => void;
}

export function NotificationList({ notifications, onItemClick }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-[300px]">
        <img 
             src="https://illustrations.popsy.co/gray/surr-no-notifications.svg" 
             alt="No notifications" 
             className="w-32 h-32 opacity-50 mb-4"
        />
        <p className="text-muted-foreground text-sm">Không có thông báo nào</p>
      </div>
    );
  }

  const grouped = notifications.reduce((acc, note) => {
    const date = new Date(note.createdAt);
    let key = "Cũ hơn";
    
    if (isToday(date)) key = "Hôm nay";
    else if (isYesterday(date)) key = "Hôm qua";
    
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
    return acc;
  }, {} as Record<string, Notification[]>);

  const order = ["Hôm nay", "Hôm qua", "Cũ hơn"];

  return (
    <ScrollArea className="h-[400px]">
      <div className="flex flex-col">
        {order.map(key => {
            const items = grouped[key];
            if (!items?.length) return null;
            
            return (
                <div key={key}>
                    <div className="sticky top-0 z-10 bg-white/95 backdrop-blur px-4 py-2 border-b border-t first:border-t-0 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {key}
                    </div>
                    <div>
                        {items.map(note => (
                            <NotificationItem 
                                key={note.id} 
                                notification={note} 
                                onClick={onItemClick}
                            />
                        ))}
                    </div>
                </div>
            );
        })}
      </div>
    </ScrollArea>
  );
}
