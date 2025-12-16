"use client";

/**
 * MonthView - Hiển thị lịch hẹn theo tháng
 *
 * Grid 7 columns × 5-6 rows, mỗi ô hiển thị tối đa 2-3 events.
 */

import {
    addDays,
    format,
    isSameDay,
    isSameMonth,
    isToday as isTodayFn
} from "date-fns";
import { vi } from "date-fns/locale";
import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import { Button, Popover, PopoverContent, PopoverTrigger, ScrollArea } from "@/shared/ui";

import { MAX_EVENTS_IN_MONTH_CELL, WEEKDAYS } from "../../constants";
import type { CalendarEvent, DateRange } from "../../types";
import { EventCard } from "../event/event-card";

// ============================================
// TYPES
// ============================================

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

interface DayCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  events: CalendarEvent[];
}

// ============================================
// COMPONENT
// ============================================

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
    const result: DayCell[][] = [];
    let currentWeek: DayCell[] = [];
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
    <div className={cn("flex flex-col h-full min-h-0", className)}>
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
      <div className="flex-1 grid grid-rows-[repeat(auto-fill,minmax(80px,1fr))]">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 border-b border-border/30 last:border-b-0">
            {week.map((dayCell) => (
              <DayCellComponent
                key={dayCell.date.toISOString()}
                dayCell={dayCell}
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

// ============================================
// DAY CELL SUB-COMPONENT
// ============================================

interface DayCellComponentProps {
  dayCell: DayCell;
  onEventClick?: (event: CalendarEvent) => void;
  onDayClick?: (date: Date) => void;
}

function DayCellComponent({ dayCell, onEventClick, onDayClick }: DayCellComponentProps) {
  const { date, isCurrentMonth, isToday, isWeekend, events } = dayCell;

  const visibleEvents = events.slice(0, MAX_EVENTS_IN_MONTH_CELL);
  const hiddenCount = events.length - MAX_EVENTS_IN_MONTH_CELL;

  return (
    <div
      className={cn(
        "min-h-[80px] p-1 border-r border-border/30 last:border-r-0",
        "flex flex-col",
        !isCurrentMonth && "bg-muted/30",
        isWeekend && isCurrentMonth && "bg-muted/10",
        isToday && "bg-primary/5"
      )}
    >
      {/* Day Number */}
      <button
        type="button"
        onClick={() => onDayClick?.(date)}
        className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium",
          "hover:bg-accent transition-colors mb-1",
          !isCurrentMonth && "text-muted-foreground/50",
          isToday && "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {format(date, "d")}
      </button>

      {/* Events List */}
      <div className="flex-1 space-y-0.5 overflow-hidden">
        {visibleEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            variant="mini"
            onClick={() => onEventClick?.(event)}
          />
        ))}

        {/* More Events Popover */}
        {hiddenCount > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="w-full h-5 text-[10px] text-muted-foreground hover:text-foreground justify-start px-1.5"
              >
                +{hiddenCount} thêm
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <div className="text-sm font-medium mb-2">
                {format(date, "EEEE, d MMMM", { locale: vi })}
              </div>
              <ScrollArea className="max-h-48">
                <div className="space-y-1">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      variant="compact"
                      onClick={() => onEventClick?.(event)}
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
