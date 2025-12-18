"use client";

import { addDays, format, isSameDay, isSameMonth } from "date-fns";
import { vi } from "date-fns/locale";
import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import { Button, Popover, PopoverContent, PopoverTrigger, ScrollArea } from "@/shared/ui";

import { WEEKDAYS } from "../../../model/constants";
import { countSchedulesOnDate, getSchedulesWithShifts } from "../../../model/schedules";
import type { DateRange, Schedule, ScheduleWithShift } from "../../../model/types";
import { ShiftChipMini } from "./shift-chip";

interface MonthViewProps {
  dateRange: DateRange;
  currentMonth: Date;
  schedules: Schedule[];
  onDayClick: (date: Date) => void;
  onScheduleClick: (schedule: ScheduleWithShift) => void;
  className?: string;
}

interface DayCell {
  date: Date;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  scheduleCount: number;
  schedules: ScheduleWithShift[];
}

/**
 * MonthView - Hiển thị lịch làm việc theo tháng (tổng quan)
 */
export function MonthView({
  dateRange,
  currentMonth,
  schedules,
  onDayClick,
  onScheduleClick,
  className,
}: MonthViewProps) {
  // Generate all days in the grid
  const weeks = useMemo(() => {
    const today = new Date();
    const result: DayCell[][] = [];
    let currentWeek: DayCell[] = [];
    let day = dateRange.start;

    while (day <= dateRange.end) {
      const dayOfWeek = day.getDay();
      const dateStr = format(day, "yyyy-MM-dd");
      const daySchedules = getSchedulesWithShifts(
        schedules.filter((s) => s.workDate === dateStr)
      );

      currentWeek.push({
        date: day,
        dateStr,
        isCurrentMonth: isSameMonth(day, currentMonth),
        isToday: isSameDay(day, today),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        scheduleCount: countSchedulesOnDate(schedules, dateStr),
        schedules: daySchedules,
      });

      // End of week (Sunday) or last day
      if (dayOfWeek === 0 || day.getTime() === dateRange.end.getTime()) {
        result.push(currentWeek);
        currentWeek = [];
      }

      day = addDays(day, 1);
    }

    return result;
  }, [dateRange, currentMonth, schedules]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Weekday Header */}
      <div className="grid grid-cols-7 border-b border-border/50">
        {WEEKDAYS.map((day) => (
          <div
            key={day.value}
            className={cn(
              "py-2 text-center text-xs font-medium text-muted-foreground",
              (day.value === 0 || day.value === 6) && "text-muted-foreground/60"
            )}
          >
            <span className="hidden sm:inline">{day.fullLabel}</span>
            <span className="sm:hidden">{day.label}</span>
          </div>
        ))}
      </div>

      {/* Weeks Grid */}
      <div className="flex-1 grid grid-rows-[repeat(auto-fill,minmax(100px,1fr))]">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b border-border/30 last:border-b-0">
            {week.map((dayCell) => (
              <DayCellComponent
                key={dayCell.dateStr}
                dayCell={dayCell}
                onDayClick={onDayClick}
                onScheduleClick={onScheduleClick}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// DAY CELL SUB-COMPONENT

interface DayCellComponentProps {
  dayCell: DayCell;
  onDayClick: (date: Date) => void;
  onScheduleClick: (schedule: ScheduleWithShift) => void;
}

function DayCellComponent({ dayCell, onDayClick, onScheduleClick }: DayCellComponentProps) {
  const { date, isCurrentMonth, isToday, isWeekend, schedules } = dayCell;

  const visibleSchedules = schedules.slice(0, 2);
  const hiddenCount = schedules.length - 2;

  return (
    <div
      className={cn(
        "min-h-[100px] p-1 border-r border-border/30 last:border-r-0",
        "flex flex-col",
        !isCurrentMonth && "bg-muted/30",
        isWeekend && isCurrentMonth && "bg-muted/10",
        isToday && "bg-primary/5"
      )}
    >
      {/* Day Number */}
      <button
        type="button"
        onClick={() => onDayClick(date)}
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium",
          "hover:bg-accent transition-colors mb-1",
          !isCurrentMonth && "text-muted-foreground/50",
          isToday && "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {format(date, "d")}
      </button>

      {/* Schedules List */}
      <div className="flex-1 space-y-0.5 overflow-hidden">
        {visibleSchedules.map((schedule) => (
          <ShiftChipMini
            key={schedule.id}
            shift={schedule.shift}
            isDraft={schedule.status === "DRAFT"}
            onClick={() => onScheduleClick(schedule)}
          />
        ))}

        {/* More Schedules Popover */}
        {hiddenCount > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-5 text-[10px] text-muted-foreground hover:text-foreground justify-start px-1.5"
              >
                +{hiddenCount} ca khác
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <div className="text-sm font-medium mb-2">
                {format(date, "EEEE, d MMMM", { locale: vi })}
              </div>
              <ScrollArea className="max-h-48">
                <div className="space-y-1">
                  {schedules.map((schedule) => (
                    <ShiftChipMini
                      key={schedule.id}
                      shift={schedule.shift}
                      isDraft={schedule.status === "DRAFT"}
                      onClick={() => onScheduleClick(schedule)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
