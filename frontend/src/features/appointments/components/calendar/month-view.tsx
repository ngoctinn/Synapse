"use client";

import {
  addDays,
  isSameDay,
  isSameMonth,
  isToday as isTodayFn,
} from "date-fns";
import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import { WEEKDAYS } from "../../constants";
import type { CalendarEvent, DateRange } from "../../model/types";
import { DayCell, type DayModel } from "./day-cell";

interface MonthViewProps {
  /** Khoảng thời gian tháng (bao gồm ngày thêm từ tuần trước/sau) */
  dateRange: DateRange;
  /** Tháng đang xem (để xác định ngày nào thuộc tháng hiện tại) */
  currentMonth: Date;
  /** Danh sách events */
  events: CalendarEvent[];
  /** Callback khi click event */
  onEventClick?: (event: CalendarEvent) => void;
  /** Callback khi click ngày */
  onDayClick?: (date: Date) => void;
  className?: string;
}

export function MonthView({
  dateRange,
  currentMonth,
  events,
  onEventClick,
  onDayClick,
  className,
}: MonthViewProps) {
  // Generate all days in the grid
  const weeks = useMemo(() => {
    const result: DayModel[][] = [];
    let currentWeek: DayModel[] = [];
    let day = dateRange.start;

    while (day <= dateRange.end) {
      const dayOfWeek = day.getDay();
      const dayEvents = events.filter((e) => isSameDay(e.start, day));

      currentWeek.push({
        date: day,
        isCurrentMonth: isSameMonth(day, currentMonth),
        isToday: isTodayFn(day),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        events: dayEvents,
      });

      // End of week (Sunday) or last day
      if (dayOfWeek === 0 || day.getTime() === dateRange.end.getTime()) {
        result.push(currentWeek);
        currentWeek = [];
      }

      day = addDays(day, 1);
    }

    return result;
  }, [dateRange, currentMonth, events]);

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {/* Weekday Header */}
      <div className="border-border/50 grid grid-cols-7 border-b">
        {WEEKDAYS.map((day) => (
          <div
            key={day.value}
            className={cn(
              "text-muted-foreground py-2 text-center text-xs font-medium",
              (day.value === 0 || day.value === 6) && "text-muted-foreground/60"
            )}
          >
            <span className="hidden sm:inline">{day.fullLabel}</span>
            <span className="sm:hidden">{day.label}</span>
          </div>
        ))}
      </div>

      {/* Weeks Grid */}
      <div className="grid flex-1 grid-rows-[repeat(auto-fill,minmax(80px,1fr))]">
        {weeks.map((week, weekIndex) => (
          <div
            key={weekIndex}
            className="border-border/30 grid grid-cols-7 border-b last:border-b-0"
          >
            {week.map((dayCell) => (
              <DayCell
                key={dayCell.date.toISOString()}
                data={dayCell}
                onEventClick={onEventClick}
                onDayClick={onDayClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
