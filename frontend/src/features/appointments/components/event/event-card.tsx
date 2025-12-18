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

import type { AppointmentStatus, CalendarEvent } from "../../types";
import { STATUS_TO_BADGE_PRESET } from "../../constants";

// ============================================
// TYPES
// ============================================

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

// ============================================
// STATUS ICONS
// ============================================

const STATUS_ICONS: Record<AppointmentStatus, React.ReactNode> = {
  PENDING: <Clock className="h-3 w-3" />,
  CONFIRMED: <CheckCircle2 className="h-3 w-3" />,
  IN_PROGRESS: <Play className="h-3 w-3" />,
  COMPLETED: <CheckCircle2 className="h-3 w-3" />,
  CANCELLED: <XCircle className="h-3 w-3" />,
  NO_SHOW: <UserX className="h-3 w-3" />,
};

// ============================================
// COMPONENT
// ============================================

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
          "flex items-center gap-1.5 px-1.5 py-0.5 rounded text-xs truncate w-full",
          "hover:brightness-95 active:scale-98 transition-all",
          isDragging && "opacity-50",
          isOverlay && "shadow-lg ring-2 ring-primary",
          hasConflict && "ring-2 ring-red-500",
          className
        )}
        style={{ backgroundColor: event.color + "20", color: event.color }}
        title={`${event.title} (${timeRange})`}
      >
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: event.color }}
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
          "flex flex-col px-2 py-1 rounded-md text-left overflow-hidden",
          "border-l-3 cursor-pointer",
          "hover:brightness-95 active:scale-[0.98] transition-all duration-150",
          isDragging && "opacity-40 scale-95",
          isOverlay && "shadow-xl ring-2 ring-offset-2 ring-primary scale-105",
          hasConflict && "ring-2 ring-red-500 ring-offset-1",
          className
        )}
        style={{
          backgroundColor: event.color + "15",
          borderLeftColor: event.color,
        }}
        title={event.title}
      >
        {/* Time + Status */}
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <span style={{ color: event.color }}>
            {STATUS_ICONS[event.status]}
          </span>
          <span>{format(event.start, "HH:mm")}</span>
          {event.isRecurring && (
            <Repeat className="h-2.5 w-2.5 text-muted-foreground" />
          )}
        </div>

        {/* Customer Name */}
        <span
          className="text-xs font-medium truncate mt-0.5"
          style={{ color: event.color }}
        >
          {event.appointment.customerName}
        </span>

        {/* Service Name (nếu đủ chiều cao) */}
        <span className="text-[10px] text-muted-foreground truncate">
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
        "flex flex-col w-full p-3 rounded-lg text-left",
        "border-l-4 cursor-pointer",
        "hover:shadow-md active:scale-[0.99] transition-all duration-200",
        "bg-card",
        isDragging && "opacity-40 scale-95",
        isOverlay && "shadow-2xl ring-2 ring-offset-2 ring-primary scale-105",
        hasConflict && "ring-2 ring-red-500",
        className
      )}
      style={{ borderLeftColor: event.color }}
    >
      {/* Header: Status + Time */}
      <div className="flex items-center justify-between mb-2">
        <Badge preset={STATUS_TO_BADGE_PRESET[event.status]} size="xs">
          {STATUS_ICONS[event.status]}
        </Badge>

        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {timeRange}
        </span>
      </div>

      {/* Customer */}
      <div className="flex items-center gap-2 mb-1">
        <User className="size-4 text-muted-foreground" />
        <span className="font-medium text-sm">
          {event.appointment.customerName}
        </span>
      </div>

      {/* Service */}
      <div
        className="text-sm px-2 py-1 rounded-md inline-flex items-center gap-1.5 w-fit"
        style={{ backgroundColor: event.color + "20", color: event.color }}
      >
        {event.appointment.serviceName}
        {event.isRecurring && <Repeat className="h-3 w-3" />}
      </div>

      {/* Staff & Room */}
      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
        <span>👤 {event.staffName}</span>
        {event.appointment.resourceName && (
          <span>📍 {event.appointment.resourceName}</span>
        )}
      </div>
    </button>
  );
}
