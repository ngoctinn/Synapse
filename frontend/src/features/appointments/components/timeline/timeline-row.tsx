"use client";

import { format } from "date-fns";
import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage, Badge } from "@/shared/ui";

import { DEFAULT_WORKING_HOURS } from "../../constants";
import type { CalendarEvent, TimelineResource, ZoomLevel } from "../../types";
import {
  calculateTimelinePosition,
  calculateTimelineWidth,
} from "./timeline-header";

interface TimelineRowProps {
  /** Resource (nhân viên/phòng) */
  resource: TimelineResource;
  /** Events của resource này */
  events: CalendarEvent[];
  /** Zoom level (phút/slot) */
  zoomLevel?: ZoomLevel;
  /** Chiều rộng mỗi slot (pixels) */
  slotWidth?: number;
  /** Giờ bắt đầu */
  startHour?: number;
  /** Giờ kết thúc */
  endHour?: number;
  /** Callback khi click event */
  onEventClick?: (event: CalendarEvent) => void;
  /** Chiều cao row */
  rowHeight?: number;
  className?: string;
}

export function TimelineRow({
  resource,
  events,
  zoomLevel = 30,
  slotWidth = 60,
  startHour = DEFAULT_WORKING_HOURS.startHour,
  endHour = DEFAULT_WORKING_HOURS.endHour,
  onEventClick,
  rowHeight = 64,
  className,
}: TimelineRowProps) {
  const totalHours = endHour - startHour;
  const slotsPerHour = 60 / zoomLevel;
  const totalSlots = totalHours * slotsPerHour;
  const totalWidth = totalSlots * slotWidth;

  const positionedEvents = useMemo(() => {
    return events.map((event) => {
      const left = calculateTimelinePosition(
        event.start,
        startHour,
        zoomLevel,
        slotWidth
      );
      const width = calculateTimelineWidth(
        event.appointment.duration,
        zoomLevel,
        slotWidth
      );

      return { event, left, width };
    });
  }, [events, startHour, zoomLevel, slotWidth]);

  return (
    <div
      className={cn("flex border-b border-border/30", className)}
      style={{ height: rowHeight }}
    >
      <div
        className={cn(
          "sticky left-0 z-10 w-48 flex-shrink-0",
          "bg-background border-r border-border/50",
          "flex items-center gap-3 px-3"
        )}
      >
        {/* Avatar */}
        <Avatar className="h-9 w-9 flex-shrink-0">
          <AvatarImage src={resource.avatar} alt={resource.name} />
          <AvatarFallback
            className="text-xs font-medium"
            style={{
              backgroundColor: resource.color + "20",
              color: resource.color,
            }}
          >
            {getInitials(resource.name)}
          </AvatarFallback>
        </Avatar>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium truncate">
              {resource.name}
            </span>
            {!resource.isActive && (
              <Badge variant="gray" size="xs">
                Nghỉ
              </Badge>
            )}
          </div>
          <span className="text-xs text-muted-foreground">
            {resource.type === "staff" ? "Kỹ thuật viên" : "Phòng"}
          </span>
        </div>
      </div>

      <div
        className="relative flex-1"
        style={{ width: totalWidth, minWidth: totalWidth }}
      >
        {/* Background grid lines */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: totalSlots }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-shrink-0 border-r",
                i % slotsPerHour === slotsPerHour - 1
                  ? "border-border/40"
                  : "border-border/20 border-dashed"
              )}
              style={{ width: slotWidth }}
            />
          ))}
        </div>

        {positionedEvents.map(({ event, left, width }) => (
          <button
            key={event.id}
            type="button"
            onClick={() => onEventClick?.(event)}
            className={cn(
              "absolute top-1 bottom-1 rounded-md px-2",
              "flex flex-col justify-center overflow-hidden",
              "text-left cursor-pointer",
              "hover:brightness-95 active:scale-[0.99] transition-all",
              "border-l-3"
            )}
            style={{
              left,
              width: Math.max(width - 4, 40), // Min width
              backgroundColor: event.color + "15",
              borderLeftColor: event.color,
            }}
            title={`${event.appointment.customerName} - ${event.appointment.serviceName}`}
          >
            <span
              className="text-xs font-medium truncate"
              style={{ color: event.color }}
            >
              {event.appointment.customerName}
            </span>
            <span className="text-[10px] text-muted-foreground truncate">
              {format(event.start, "HH:mm")} - {event.appointment.serviceName}
            </span>
          </button>
        ))}

        {events.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs text-muted-foreground/50 italic">
              Không có lịch hẹn
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
