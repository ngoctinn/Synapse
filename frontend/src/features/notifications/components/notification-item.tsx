"use client";

import { Notification } from "../model/types";
import { cn } from "@/shared/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { 
  Calendar, 
  AlertCircle, 
  Info, 
  MessageSquare, 
  User 
} from "lucide-react";

interface NotificationItemProps {
  notification: Notification;
  onClick?: (id: string) => void;
}

export function NotificationItem({ notification, onClick }: NotificationItemProps) {
  const Icon = getIcon(notification.type);
  const iconColor = getIconColor(notification.type);

  return (
    <div
      onClick={() => onClick?.(notification.id)}
      className={cn(
        "flex items-start gap-4 p-4 border-b last:border-0 hover:bg-slate-50 transition-colors cursor-pointer group relative",
        !notification.read && "bg-blue-50/40 hover:bg-blue-50/60"
      )}
    >
      <div className={cn("mt-1 p-2 rounded-full shrink-0", iconColor)}>
        <Icon className="w-4 h-4" />
      </div>
      
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
            <p className={cn("text-sm font-medium leading-none", !notification.read && "text-blue-700")}>
            {notification.title}
            </p>
            {!notification.read && (
                <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-4 right-4" />
            )}
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {notification.description}
        </p>
        
        <p className="text-xs text-slate-400">
          {formatDistanceToNow(new Date(notification.createdAt), { 
            addSuffix: true, 
            locale: vi 
          })}
        </p>
      </div>
    </div>
  );
}

function getIcon(type: Notification['type']) {
  switch (type) {
    case 'booking': return Calendar;
    case 'alert': return AlertCircle;
    case 'system': return Info;
    case 'staff': return MessageSquare;
    default: return Info;
  }
}

function getIconColor(type: Notification['type']) {
  switch (type) {
    case 'booking': return "bg-blue-100 text-blue-600";
    case 'alert': return "bg-red-100 text-red-600";
    case 'system': return "bg-slate-100 text-slate-600";
    case 'staff': return "bg-purple-100 text-purple-600";
    default: return "bg-slate-100 text-slate-600";
  }
}
