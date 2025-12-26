"use client";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { CheckCheck, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { useNotificationStore } from "../hooks/use-notification-store";
import { NotificationList } from "./notification-list";

interface NotificationPopoverProps {
  children: React.ReactNode;
}

export function NotificationPopover({ children }: NotificationPopoverProps) {
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const fetchNotifications = useNotificationStore(
    (state) => state.fetchNotifications
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleMarkAllRead = () => {
    markAllAsRead();
  };

  const handleItemClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[380px] p-0" align="end" sideOffset={8}>
        <div className="flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">Thông báo</h4>
            {unreadCount > 0 && <Badge preset="count">{unreadCount}</Badge>}
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-primary h-8 w-8"
              title="Đánh dấu tất cả đã đọc"
              onClick={handleMarkAllRead}
            >
              <CheckCheck className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground h-8 w-8"
              title="Cài đặt thông báo"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              Tất cả
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1">
              Chưa đọc
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="m-0 focus-visible:outline-none">
            <NotificationList
              notifications={notifications}
              onItemClick={handleItemClick}
            />
          </TabsContent>
          <TabsContent
            value="unread"
            className="m-0 focus-visible:outline-none"
          >
            <NotificationList
              notifications={notifications.filter((n) => !n.read)}
              onItemClick={handleItemClick}
            />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
