"use client";

/**
 * WeekView - Hiển thị lịch hẹn theo tuần
 *
 * 7 columns (T2-CN), TimeGrid shared, events positioned theo ngày và giờ.
 */

import { addDays, isSameDay } from "date-fns";
import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/ui";

import { DEFAULT_WORKING_HOURS, HOUR_HEIGHT } from "../../constants";
import type { CalendarEvent, DateRange, DensityMode } from "../../types";
import { EventPopover } from "../event";
import { EventCard } from "../event/event-card";
import { DateHeader } from "./date-header";
import { TimeGrid, calculateEventPosition } from "./time-grid";

// ============================================
// TYPES
// ============================================

interface WeekViewProps {
  /** Khoảng thời gian tuần */
  dateRange: DateRange;
  /** Danh sách events */
  events: CalendarEvent[];
  /** Density mode */
  densityMode?: DensityMode;
  /** Callback khi click event */
  onEventClick?: (event: CalendarEvent) => void;
  /** Callback khi click slot trống */
  onSlotClick?: (date: Date, hour: number, minute: number) => void;
  /** Ẩn cuối tuần */
  hideWeekends?: boolean;
  className?: string;
  // Actions
  onCheckIn?: (event: CalendarEvent) => void;
  onNoShow?: (event: CalendarEvent) => void;
  onCancel?: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
  onEdit?: (event: CalendarEvent) => void;
}

// ============================================
// COMPONENT
// ============================================

export function WeekView({
  dateRange,
  events,
  densityMode = "comfortable",
  onEventClick,
  onSlotClick,
  hideWeekends = false,
  className,
  onCheckIn,
  onNoShow,
  onCancel,
  onDelete,
  onEdit,
}: WeekViewProps) {
  const hourHeight = HOUR_HEIGHT[densityMode];
  const { startHour, endHour } = DEFAULT_WORKING_HOURS;
  const totalHours = endHour - startHour;
  const totalHeight = totalHours * hourHeight;

  // Generate days of the week
  const weekDays = useMemo(() => {
    const days: Date[] = [];
    let currentDay = dateRange.start;

    while (currentDay <= dateRange.end) {
      const dayOfWeek = currentDay.getDay();
      // Skip weekends if hideWeekends is true
      if (!hideWeekends || (dayOfWeek !== 0 && dayOfWeek !== 6)) {
        days.push(currentDay);
      }
      currentDay = addDays(currentDay, 1);
    }

    return days;
  }, [dateRange, hideWeekends]);

  const numberOfDays = weekDays.length;

  // Group events by day
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();

    for (const day of weekDays) {
      const key = day.toISOString().split("T")[0];
      const dayEvents = events.filter((event) => isSameDay(event.start, day));
      map.set(key, dayEvents);
    }

    return map;
  }, [weekDays, events]);

  // Position events với overlap handling
  const positionedEventsByDay = useMemo(() => {
    const result = new Map<
      string,
      Array<{
        event: CalendarEvent;
        column: number;
        totalColumns: number;
        position: { top: number; height: number };
      }>
    >();

    for (const [dateKey, dayEvents] of eventsByDay) {
      if (dayEvents.length === 0) {
        result.set(dateKey, []);
        continue;
      }

      const sorted = [...dayEvents].sort(
        (a, b) => a.start.getTime() - b.start.getTime()
      );

      const positioned: Array<{
        event: CalendarEvent;
        column: number;
        totalColumns: number;
        position: { top: number; height: number };
      }> = [];

      for (const event of sorted) {
        const position = calculateEventPosition(
          event.start,
          event.end,
          startHour,
          hourHeight
        );

        const overlapping = positioned.filter(
          (p) =>
            p.position.top < position.top + position.height &&
            p.position.top + p.position.height > position.top
        );

        if (overlapping.length === 0) {
          positioned.push({ event, column: 0, totalColumns: 1, position });
        } else {
          const usedColumns = new Set(overlapping.map((p) => p.column));
          let column = 0;
          while (usedColumns.has(column)) column++;

          const newTotalColumns = Math.max(
            column + 1,
            ...overlapping.map((p) => p.totalColumns)
          );

          for (const p of overlapping) {
            p.totalColumns = newTotalColumns;
          }

          positioned.push({
            event,
            column,
            totalColumns: newTotalColumns,
            position,
          });
        }
      }

      result.set(dateKey, positioned);
    }

    return result;
  }, [eventsByDay, startHour, hourHeight]);

  return (
    <div className={cn("flex flex-col h-full min-h-0", className)}>
      {/* Date Header */}
      <DateHeader startDate={dateRange.start} numberOfDays={numberOfDays} />

      {/* Scrollable Grid Area */}
      <ScrollArea className="flex-1 min-h-0">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `3.5rem repeat(${numberOfDays}, 1fr)`,
            height: totalHeight,
          }}
        >
          {/* Time Labels Column */}
          <TimeGrid
            date={dateRange.start}
            startHour={startHour}
            endHour={endHour}
            densityMode={densityMode}
          />

          {/* Day Columns */}
          {weekDays.map((day, dayIndex) => {
            const dateKey = day.toISOString().split("T")[0];
            const dayPositionedEvents = positionedEventsByDay.get(dateKey) || [];
            const isWeekend = day.getDay() === 0 || day.getDay() === 6;

            return (
              <div
                key={dateKey}
                className={cn(
                  "relative border-r border-border/30 last:border-r-0",
                  isWeekend && "bg-muted/20"
                )}
                style={{ height: totalHeight }}
              >
                {/* Hour lines (copy from TimeGrid pattern) */}
                {Array.from({ length: totalHours }).map((_, hourIndex) => (
                  <div
                    key={`line-${hourIndex}`}
                    className="absolute left-0 right-0 border-t border-border/30"
                    style={{ top: hourIndex * hourHeight }}
                  />
                ))}

                {/* Half-hour lines */}
                {Array.from({ length: totalHours }).map((_, hourIndex) => (
                  <div
                    key={`half-${hourIndex}`}
                    className="absolute left-0 right-0 border-t border-border/20 border-dashed"
                    style={{ top: hourIndex * hourHeight + hourHeight / 2 }}
                  />
                ))}

                {/* Events */}
                {dayPositionedEvents.map(
                  ({ event, column, totalColumns, position }) => {
                    const width = 100 / totalColumns;
                    const left = column * width;

                    return (
                      <div
                        key={event.id}
                        className="absolute px-0.5"
                        style={{
                          top: position.top,
                          height: position.height,
                          left: `${left}%`,
                          width: `${width}%`,
                        }}
                      >
                        <EventPopover
                          event={event}
                          onView={() => onEventClick?.(event)}
                          onCheckIn={() => onCheckIn?.(event)}
                          onNoShow={() => onNoShow?.(event)}
                          onCancel={() => onCancel?.(event)}
                          onDelete={() => onDelete?.(event)}
                          onEdit={() => onEdit?.(event)}
                        >
                          <EventCard
                            event={event}
                            variant="compact"
                            className="h-full"
                          />
                        </EventPopover>
                      </div>
                    );
                  }
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
