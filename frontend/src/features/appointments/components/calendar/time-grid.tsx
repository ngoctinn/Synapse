"use client";

/**
 * TimeGrid - Component hiển thị lưới giờ cho Day/Week view
 *
 * Hiển thị:
 * - Cột giờ bên trái (08:00, 09:00, ...)
 * - Đường kẻ ngang cho mỗi giờ và nửa giờ
 * - Current time indicator (đường đỏ)
 */

import { format, isToday, setHours, setMinutes } from "date-fns";
import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import { DEFAULT_WORKING_HOURS, HOUR_HEIGHT } from "../../constants";
import type { DensityMode } from "../../model/types";


interface TimeGridProps {
  /** Ngày để xác định current time indicator */
  date: Date;
  /** Giờ bắt đầu (mặc định: 8) */
  startHour?: number;
  /** Giờ kết thúc (mặc định: 21) */
  endHour?: number;
  /** Interval giữa các slot (phút): 15, 30, 60 */
  interval?: 15 | 30 | 60;
  /** Chế độ density */
  densityMode?: DensityMode;
  /** Nội dung bên trong grid (events) */
  children?: React.ReactNode;
  /** Số cột (ngày) - cho week view */
  columns?: number;
  className?: string;
}

interface TimeSlotInternal {
  hour: number;
  minute: number;
  label: string;
  isHourStart: boolean;
}


export function TimeGrid({
  date,
  startHour = DEFAULT_WORKING_HOURS.startHour,
  endHour = DEFAULT_WORKING_HOURS.endHour,
  interval = 30,
  densityMode = "comfortable",
  children,
  className,
}: TimeGridProps) {
  // Tính chiều cao mỗi giờ
  const hourHeight = HOUR_HEIGHT[densityMode];
  const slotHeight = hourHeight / (60 / interval);
  const totalHours = endHour - startHour;
  const totalHeight = totalHours * hourHeight;

  // Generate time slots
  const timeSlots = useMemo((): TimeSlotInternal[] => {
    const slots: TimeSlotInternal[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += interval) {
        const time = setMinutes(setHours(new Date(), hour), minute);
        slots.push({
          hour,
          minute,
          label: format(time, "HH:mm"),
          isHourStart: minute === 0,
        });
      }
    }

    return slots;
  }, [startHour, endHour, interval]);

  // Current time position (chỉ hiển thị nếu đang xem hôm nay)
  const currentTimePosition = useMemo(() => {
    if (!isToday(date)) return null;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Nếu ngoài giờ làm việc
    if (currentHour < startHour || currentHour >= endHour) return null;

    // Tính vị trí (pixels từ top)
    const hoursFromStart = currentHour - startHour;
    const positionInHour = currentMinute / 60;
    const position = (hoursFromStart + positionInHour) * hourHeight;

    return position;
  }, [date, startHour, endHour, hourHeight]);

  return (
    <div
      className={cn("relative flex", className)}
      style={{ height: totalHeight }}
    >
      {/* ============================================ */}
      {/* TIME LABELS COLUMN */}
      {/* ============================================ */}
      <div className="flex-none w-14 sm:w-16 relative border-r border-border/50 bg-muted/30">
        {timeSlots
          .filter((slot) => slot.isHourStart)
          .map((slot) => {
            const top = (slot.hour - startHour) * hourHeight;
            return (
              <div
                key={`label-${slot.hour}`}
                className="absolute right-2 -translate-y-1/2 text-xs text-muted-foreground font-medium"
                style={{ top }}
              >
                {slot.label}
              </div>
            );
          })}
      </div>

      {/* ============================================ */}
      {/* GRID AREA */}
      {/* ============================================ */}
      <div className="flex-1 relative">
        {/* Horizontal Lines (giờ và nửa giờ) */}
        {timeSlots.map((slot, index) => {
          const top = index * slotHeight;
          return (
            <div
              key={`line-${slot.hour}-${slot.minute}`}
              className={cn(
                "absolute left-0 right-0 border-t",
                slot.isHourStart
                  ? "border-border/60"
                  : "border-border/30 border-dashed"
              )}
              style={{ top }}
            />
          );
        })}

        {/* Bottom border */}
        <div
          className="absolute left-0 right-0 border-t border-border/60"
          style={{ top: totalHeight }}
        />

        {/* ============================================ */}
        {/* CURRENT TIME INDICATOR */}
        {/* ============================================ */}
        {currentTimePosition !== null && (
          <div
            className="absolute left-0 right-0 z-20 pointer-events-none"
            style={{ top: currentTimePosition }}
          >
            {/* Red dot */}
            <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-red-500 shadow-md" />
            {/* Red line */}
            <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-sm" />
          </div>
        )}

        {/* ============================================ */}
        {/* EVENTS CONTAINER */}
        {/* ============================================ */}
        <div className="absolute inset-0">{children}</div>
      </div>
    </div>
  );
}


/**
 * Tính vị trí top và height cho một event dựa trên thời gian
 */
export function calculateEventPosition(
  eventStart: Date,
  eventEnd: Date,
  startHour: number,
  hourHeight: number
): { top: number; height: number } {
  const eventStartHour = eventStart.getHours();
  const eventStartMinute = eventStart.getMinutes();
  const eventEndHour = eventEnd.getHours();
  const eventEndMinute = eventEnd.getMinutes();

  // Top position
  const hoursFromStart = eventStartHour - startHour;
  const minuteFraction = eventStartMinute / 60;
  const top = (hoursFromStart + minuteFraction) * hourHeight;

  // Height
  const durationHours =
    eventEndHour - eventStartHour + (eventEndMinute - eventStartMinute) / 60;
  const height = durationHours * hourHeight;

  return { top: Math.max(0, top), height: Math.max(hourHeight / 4, height) };
}
