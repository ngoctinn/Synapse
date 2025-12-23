"use client";

/**
 * DateHeader - Component hiển thị header ngày cho Week/Day view
 *
 * Hiển thị: T2 11, T3 12, ..., CN 17 (với highlight cho hôm nay)
 */

import { addDays, format, isToday as isTodayFn } from "date-fns";
import { vi } from "date-fns/locale";
import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import { WEEKDAYS } from "../../constants";

interface DateHeaderProps {
  /** Ngày bắt đầu của tuần/khoảng thời gian */
  startDate: Date;
  /** Số ngày cần hiển thị (mặc định: 7 cho week) */
  numberOfDays?: number;
  /** Có sticky header không */
  sticky?: boolean;
  /** Single day mode (cho day view) */
  singleDay?: boolean;
  className?: string;
}

interface DayInfo {
  date: Date;
  dayOfWeek: string; // T2, T3, ...
  dayOfMonth: number; // 11, 12, ...
  isToday: boolean;
  isWeekend: boolean;
}

export function DateHeader({
  startDate,
  numberOfDays = 7,
  sticky = true,
  singleDay = false,
  className,
}: DateHeaderProps) {
  // Generate days info
  const days = useMemo((): DayInfo[] => {
    const result: DayInfo[] = [];

    for (let i = 0; i < numberOfDays; i++) {
      const date = addDays(startDate, i);
      const dayOfWeekIndex = date.getDay(); // 0 = CN, 1 = T2, ...

      result.push({
        date,
        dayOfWeek:
          WEEKDAYS.find((d) => d.value === dayOfWeekIndex)?.label || "",
        dayOfMonth: date.getDate(),
        isToday: isTodayFn(date),
        isWeekend: dayOfWeekIndex === 0 || dayOfWeekIndex === 6,
      });
    }

    return result;
  }, [startDate, numberOfDays]);

  // Single day mode
  if (singleDay && days.length > 0) {
    const day = days[0];
    return (
      <div
        className={cn(
          "border-border/50 bg-background flex items-center justify-center border-b px-4 py-3",
          sticky && "sticky top-0 z-10",
          className
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold",
              day.isToday
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            )}
          >
            {day.dayOfMonth}
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {format(day.date, "EEEE", { locale: vi })}
            </span>
            <span className="text-muted-foreground text-xs">
              {format(day.date, "d MMMM, yyyy", { locale: vi })}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Week/Multi-day mode
  return (
    <div
      className={cn(
        "border-border/50 bg-background grid border-b",
        sticky && "sticky top-0 z-10",
        className
      )}
      style={{
        gridTemplateColumns: `3.5rem repeat(${numberOfDays}, 1fr)`, // Time label + days
      }}
    >
      {/* Empty cell for time column */}
      <div className="border-border/50 border-r" />

      {/* Day headers */}
      {days.map((day) => (
        <div
          key={day.date.toISOString()}
          className={cn(
            "border-border/30 flex flex-col items-center justify-center border-r py-2 last:border-r-0",
            day.isWeekend && "bg-muted/30",
            day.isToday && "bg-primary/5"
          )}
        >
          {/* Day of week label */}
          <span
            className={cn(
              "text-xs font-medium",
              day.isToday ? "text-primary" : "text-muted-foreground"
            )}
          >
            {day.dayOfWeek}
          </span>

          {/* Day of month number */}
          <span
            className={cn(
              "mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold",
              day.isToday
                ? "bg-primary text-primary-foreground"
                : "text-foreground"
            )}
          >
            {day.dayOfMonth}
          </span>
        </div>
      ))}
    </div>
  );
}
