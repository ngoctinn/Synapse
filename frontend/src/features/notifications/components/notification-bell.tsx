"use client";

import { Bell } from "lucide-react";
import { Button, ButtonProps } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import React from "react";

interface NotificationBellProps extends ButtonProps {
  unreadCount?: number;
}

export const NotificationBell = React.forwardRef<HTMLButtonElement, NotificationBellProps>(
  ({ unreadCount = 0, className, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn(
            "relative rounded-full w-9 h-9 hover:bg-slate-100 text-slate-600 transition-transform hover:scale-105",
            className
        )}
        {...props}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
              <span className="sr-only">{unreadCount} thông báo mới</span>
          </>
        )}
      </Button>
    );
  }
);
NotificationBell.displayName = "NotificationBell";
