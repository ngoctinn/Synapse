"use client";

/**
 * EventCard - Component hiển thị một cuộc hẹn trên Calendar
 *
 * Có nhiều variants:
 * - default: Full info (time, customer, service, staff)
 * - compact: Chỉ hiển thị title và time (cho Week/Day view)
 * - mini: Chỉ dot indicator (cho Month view)
 */

import { format } from "date-fns";
import {
  CheckCircle2,
  Clock,
  Play,
  Repeat,
  User,
  UserX,
  XCircle,
} from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui";

import type { AppointmentStatus, CalendarEvent } from "../../model/types";
import { STATUS_TO_BADGE_PRESET } from "../../constants";

interface EventCardProps {
  event: CalendarEvent;
  /** Variant hiển thị */
  variant?: "default" | "compact" | "mini";
  /** Đang được kéo */
  isDragging?: boolean;
  /** Là overlay khi kéo */
  isOverlay?: boolean;
  /** Có xung đột */
  hasConflict?: boolean;
  /** Click handler */
  onClick?: () => void;
  className?: string;
}

const STATUS_ICONS: Record<AppointmentStatus, React.ReactNode> = {
  PENDING: <Clock className="h-3 w-3" />,
  CONFIRMED: <CheckCircle2 className="h-3 w-3" />,
  IN_PROGRESS: <Play className="h-3 w-3" />,
  COMPLETED: <CheckCircle2 className="h-3 w-3" />,
  CANCELLED: <XCircle className="h-3 w-3" />,
  NO_SHOW: <UserX className="h-3 w-3" />,
};

// Helper to handle background color with opacity safely
const getEventStyles = (color: string, opacity: string) => {
  // If color is hex, we can safely use it with opacity if we ensure it starts with #
  const baseColor = color.startsWith("#") ? color : `#${color}`;
  return {
    backgroundColor: `${baseColor}${opacity}`,
    color: baseColor,
  };
};

export function EventCard({
  event,
  variant = "default",
  isDragging = false,
  isOverlay = false,
  hasConflict = false,
  onClick,
  className,
}: EventCardProps) {
  const timeRange = `${format(event.start, "HH:mm")} - ${format(
    event.end,
    "HH:mm"
  )}`;

  // Mini variant (dot)
  if (variant === "mini") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-1.5 truncate rounded px-1.5 py-0.5 text-xs transition-all",
          "active:bg-muted/50 hover:brightness-95",
          isDragging && "opacity-50",
          isOverlay && "ring-primary shadow-lg ring-2",
          hasConflict && "ring-2 ring-red-500",
          className
        )}
        style={getEventStyles(event.color, "20")}
        title={`${event.title} (${timeRange})`}
      >
        <span
          className="h-2 w-2 flex-shrink-0 rounded-full"
          style={{ backgroundColor: event.color.startsWith("#") ? event.color : `#${event.color}` }}
        />
        <span className="truncate">{event.appointment.customerName}</span>
      </button>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex flex-col overflow-hidden rounded-lg px-2 py-1 text-left",
          "border-l-3 cursor-pointer",
          "transition-all duration-150 hover:brightness-95",
          isDragging && "scale-95 opacity-40",
          isOverlay && "ring-primary scale-105 shadow-xl ring-2 ring-offset-2",
          hasConflict && "ring-2 ring-red-500 ring-offset-1",
          className
        )}
        style={{
          ...getEventStyles(event.color, "15"),
          borderLeftColor: event.color.startsWith("#") ? event.color : `#${event.color}`,
        }}
        title={event.title}
      >
        {/* Time + Status */}
        <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
          <span style={{ color: event.color.startsWith("#") ? event.color : `#${event.color}` }}>
            {STATUS_ICONS[event.status]}
          </span>
          <span>{format(event.start, "HH:mm")}</span>
          {event.isRecurring && (
            <Repeat className="text-muted-foreground h-2.5 w-2.5" />
          )}
        </div>

        {/* Customer Name */}
        <span
          className="mt-0.5 truncate text-xs font-medium"
          style={{ color: event.color.startsWith("#") ? event.color : `#${event.color}` }}
        >
          {event.appointment.customerName}
        </span>

        {/* Service Name (nếu đủ chiều cao) */}
        <span className="text-muted-foreground truncate text-[10px]">
          {event.appointment.serviceName}
        </span>
      </button>
    );
  }

  // Default variant (full)
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full flex-col rounded-lg p-3 text-left",
        "cursor-pointer border-l-4",
        "transition-all duration-200 hover:shadow-md",
        "bg-card",
        isDragging && "scale-95 opacity-40",
        isOverlay && "ring-primary scale-105 shadow-2xl ring-2 ring-offset-2",
        hasConflict && "ring-2 ring-red-500",
        className
      )}
      style={{ borderLeftColor: event.color.startsWith("#") ? event.color : `#${event.color}` }}
    >
      {/* Header: Status + Time */}
      <div className="mb-2 flex items-center justify-between">
        <Badge preset={STATUS_TO_BADGE_PRESET[event.status]} size="xs">
          {STATUS_ICONS[event.status]}
        </Badge>

        <span className="text-muted-foreground flex items-center gap-1 text-xs">
          <Clock className="h-3 w-3" />
          {timeRange}
        </span>
      </div>

      {/* Customer */}
      <div className="mb-1 flex items-center gap-2">
        <User className="text-muted-foreground size-4" />
        <span className="text-sm font-medium">
          {event.appointment.customerName}
        </span>
      </div>

      {/* Service */}
      <div
        className="inline-flex w-fit items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium"
        style={getEventStyles(event.color, "20")}
      >
        {event.appointment.serviceName}
        {event.isRecurring && <Repeat className="h-3 w-3" />}
      </div>

      {/* Staff & Room */}
      <div className="text-muted-foreground mt-2 flex items-center gap-3 text-xs">
        <span>👤 {event.staffName}</span>
        {event.appointment.resourceName && (
          <span>📍 {event.appointment.resourceName}</span>
        )}
      </div>
    </button>
  );
}
