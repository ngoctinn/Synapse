"use client";

/**
 * TimelineHeader - Header cho Resource Timeline view
 *
 * Hiển thị thước thời gian theo giờ, sticky khi scroll.
 */

import { format, setHours, setMinutes } from "date-fns";
import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import { DEFAULT_WORKING_HOURS } from "../../constants";
import type { ZoomLevel } from "../../types";

// ============================================
// TYPES
// ============================================

interface TimelineHeaderProps {
  /** Ngày đang xem */
  date: Date;
  /** Giờ bắt đầu */
  startHour?: number;
  /** Giờ kết thúc */
  endHour?: number;
  /** Zoom level (phút/slot) */
  zoomLevel?: ZoomLevel;
  /** Chiều rộng mỗi slot (pixels) */
  slotWidth?: number;
  className?: string;
}

interface TimeSlot {
  hour: number;
  minute: number;
  label: string;
  isHourStart: boolean;
}

// ============================================
// COMPONENT
// ============================================

export function TimelineHeader({
  date,
  startHour = DEFAULT_WORKING_HOURS.startHour,
  endHour = DEFAULT_WORKING_HOURS.endHour,
  zoomLevel = 30,
  slotWidth = 60,
  className,
}: TimelineHeaderProps) {
  // Generate time slots
  const timeSlots = useMemo((): TimeSlot[] => {
    const slots: TimeSlot[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += zoomLevel) {
        const time = setMinutes(setHours(date, hour), minute);
        slots.push({
          hour,
          minute,
          label: format(time, "HH:mm"),
          isHourStart: minute === 0,
        });
      }
    }

    return slots;
  }, [date, startHour, endHour, zoomLevel]);

  const totalWidth = timeSlots.length * slotWidth;

  return (
    <div
      className={cn(
        "flex sticky top-0 z-20 bg-background border-b border-border/50",
        className
      )}
    >
      {/* Resource column header (sticky left) */}
      <div className="sticky left-0 z-30 w-48 flex-shrink-0 bg-background border-r border-border/50 p-2">
        <span className="text-xs font-medium text-muted-foreground">
          Nhân viên / Phòng
        </span>
      </div>

      {/* Time slots */}
      <div className="flex" style={{ width: totalWidth }}>
        {timeSlots.map((slot, index) => (
          <div
            key={`${slot.hour}-${slot.minute}`}
            className={cn(
              "flex-shrink-0 border-r border-border/30",
              "flex items-center justify-center py-2",
              slot.isHourStart ? "border-r-border/60" : "border-dashed"
            )}
            style={{ width: slotWidth }}
          >
            <span
              className={cn(
                "text-xs",
                slot.isHourStart
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {slot.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// HELPER: Calculate slot position from time
// ============================================

export function calculateTimelinePosition(
  eventTime: Date,
  startHour: number,
  zoomLevel: ZoomLevel,
  slotWidth: number
): number {
  const eventHour = eventTime.getHours();
  const eventMinute = eventTime.getMinutes();

  const totalMinutesFromStart = (eventHour - startHour) * 60 + eventMinute;
  const slotIndex = totalMinutesFromStart / zoomLevel;

  return slotIndex * slotWidth;
}

export function calculateTimelineWidth(
  durationMinutes: number,
  zoomLevel: ZoomLevel,
  slotWidth: number
): number {
  const slots = durationMinutes / zoomLevel;
  return slots * slotWidth;
}
