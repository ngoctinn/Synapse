"use client";

import { cn } from "@/shared/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { AlertCircle, Calendar, Info, MessageSquare } from "lucide-react";
import { Notification } from "../model/types";

interface NotificationItemProps {
  notification: Notification;
  onClick?: (id: string) => void;
}

const ICONS = {
  booking: Calendar,
  alert: AlertCircle,
  system: Info,
  staff: MessageSquare,
} as const;

export function NotificationItem({
  notification,
  onClick,
}: NotificationItemProps) {
  const Icon = ICONS[notification.type as keyof typeof ICONS] || Info;
  const iconColor = getIconColor(notification.type);

  return (
    <div
      onClick={() => onClick?.(notification.id)}
      className={cn(
        "hover:bg-muted/50 group relative flex cursor-pointer items-start gap-4 border-b p-4 transition-colors last:border-0",
        !notification.read && "bg-alert-info/40 hover:bg-alert-info/60"
      )}
    >
      <div className={cn("mt-1 shrink-0 rounded-full p-2", iconColor)}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p
            className={cn(
              "text-sm font-medium leading-none",
              !notification.read && "text-alert-info-foreground"
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="bg-info absolute right-4 top-4 h-2 w-2 rounded-full" />
          )}
        </div>

        <p className="text-muted-foreground line-clamp-2 text-sm">
          {notification.description}
        </p>

        <p className="text-muted-foreground text-xs">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
            locale: vi,
          })}
        </p>
      </div>
    </div>
  );
}

// function getIcon(type: Notification['type']) {
//   switch (type) {
//     case 'booking': return Calendar;
//     case 'alert': return AlertCircle;
//     case 'system': return Info;
//     case 'staff': return MessageSquare;
//     default: return Info;
//   }
// }

function getIconColor(type: Notification["type"]) {
  switch (type) {
    case "booking":
      return "bg-alert-info text-alert-info-foreground";
    case "alert":
      return "bg-destructive/10 text-destructive";
    case "system":
      return "bg-muted text-muted-foreground";
    case "staff":
      return "bg-secondary text-secondary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
}
