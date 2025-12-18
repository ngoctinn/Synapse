"use client";

import { addDays } from "date-fns";
import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/ui";

import { DEFAULT_WORKING_HOURS, HOUR_HEIGHT } from "../../constants";
import type { CalendarEvent, DateRange, DensityMode } from "../../types";
import { EventPopover } from "../event";
import { EventCard } from "../event/event-card";
import { DateHeader } from "./date-header";
import { TimeGrid } from "./time-grid";
import { useWeekEventLayout } from "./use-week-event-layout";

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

export function WeekView({
  dateRange,
  events,
  densityMode = "comfortable",
  onEventClick,
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

  const positionedEventsByDay = useWeekEventLayout({
    weekDays,
    events,
    startHour,
    hourHeight,
  });

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
          {weekDays.map((day) => {
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
