"use client";

import { isSameDay } from "date-fns";
import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/ui";

import { DEFAULT_WORKING_HOURS, HOUR_HEIGHT } from "../../constants";
import type { CalendarEvent, DensityMode } from "../../model/types";
import { EventPopover } from "../event";
import { EventCard } from "../event/event-card";
import { DateHeader } from "./date-header";
import { TimeGrid } from "./time-grid";
import { calculateEventLayout } from "./layout-utils";

interface DayViewProps {
  /** Ngày đang xem */
  date: Date;
  /** Danh sách events */
  events: CalendarEvent[];
  /** Density mode */
  densityMode?: DensityMode;
  /** Callback khi click event */
  onEventClick?: (event: CalendarEvent) => void;
  /** Callback khi click slot trống */
  onSlotClick?: (date: Date, hour: number, minute: number) => void;
  className?: string;
  // Actions
  onCheckIn?: (event: CalendarEvent) => void;
  onNoShow?: (event: CalendarEvent) => void;
  onCancel?: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
  onEdit?: (event: CalendarEvent) => void;
}

export function DayView({
  date,
  events,
  densityMode = "comfortable",
  onEventClick,
  className,
  onCheckIn,
  onNoShow,
  onCancel,
  onDelete,
  onEdit,
}: DayViewProps) {
  const hourHeight = HOUR_HEIGHT[densityMode];
  const { startHour, endHour } = DEFAULT_WORKING_HOURS;

  // Filter events cho ngày này
  const dayEvents = useMemo(() => {
    return events.filter((event) => isSameDay(event.start, date));
  }, [events, date]);

  // Group overlapping events
  const positionedEvents = useMemo(() => {
    return calculateEventLayout(dayEvents, startHour, hourHeight);
  }, [dayEvents, startHour, hourHeight]);

  return (
    <div className={cn("flex h-full min-h-0 flex-col", className)}>
      {/* Date Header */}
      <DateHeader startDate={date} numberOfDays={1} singleDay />

      {/* Scrollable Time Grid */}
      <ScrollArea className="min-h-0 flex-1">
        <TimeGrid
          date={date}
          startHour={startHour}
          endHour={endHour}
          densityMode={densityMode}
        >
          {/* Events */}
          {positionedEvents.map(({ event, column, totalColumns, position }) => {
            const width = 100 / totalColumns;
            const left = column * width;

            return (
              <div
                key={event.id}
                className="absolute pr-1"
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
          })}
        </TimeGrid>
      </ScrollArea>
    </div>
  );
}
