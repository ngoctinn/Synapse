"use client";

import { cn } from "@/shared/lib/utils";
import { Button, ButtonProps } from "@/shared/ui/button";
import { Bell } from "lucide-react";
import React from "react";

interface NotificationBellProps extends ButtonProps {
  unreadCount?: number;
}

export const NotificationBell = React.forwardRef<
  HTMLButtonElement,
  NotificationBellProps
>(({ unreadCount = 0, className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      className={cn(
        "hover:bg-muted text-muted-foreground relative h-9 w-9 rounded-full transition-transform hover:scale-105",
        className
      )}
      {...props}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <>
          <span className="bg-destructive absolute right-2 top-2 h-2 w-2 animate-pulse rounded-full border border-white" />
          <span className="sr-only">{unreadCount} thông báo mới</span>
        </>
      )}
    </Button>
  );
});
NotificationBell.displayName = "NotificationBell";
