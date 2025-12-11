"use client";

/**
 * DayView - Hiển thị lịch hẹn theo ngày
 *
 * Single column với TimeGrid, events positioned theo thời gian.
 */

import { isSameDay } from "date-fns";
import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/ui";

import { DEFAULT_WORKING_HOURS, HOUR_HEIGHT } from "../../constants";
import type { CalendarEvent, DensityMode } from "../../types";
import { EventCard } from "../event/event-card";
import { DateHeader } from "./date-header";
import { TimeGrid, calculateEventPosition } from "./time-grid";

// ============================================
// TYPES
// ============================================

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
}

// ============================================
// COMPONENT
// ============================================

export function DayView({
  date,
  events,
  densityMode = "comfortable",
  onEventClick,
  onSlotClick,
  className,
}: DayViewProps) {
  const hourHeight = HOUR_HEIGHT[densityMode];
  const { startHour, endHour } = DEFAULT_WORKING_HOURS;

  // Filter events cho ngày này
  const dayEvents = useMemo(() => {
    return events.filter((event) => isSameDay(event.start, date));
  }, [events, date]);

  // Group overlapping events
  const positionedEvents = useMemo(() => {
    if (dayEvents.length === 0) return [];

    // Sort by start time
    const sorted = [...dayEvents].sort(
      (a, b) => a.start.getTime() - b.start.getTime()
    );

    // Find overlapping groups and assign columns
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

      // Find overlapping events already positioned
      const overlapping = positioned.filter(
        (p) =>
          p.position.top < position.top + position.height &&
          p.position.top + p.position.height > position.top
      );

      if (overlapping.length === 0) {
        positioned.push({ event, column: 0, totalColumns: 1, position });
      } else {
        // Find available column
        const usedColumns = new Set(overlapping.map((p) => p.column));
        let column = 0;
        while (usedColumns.has(column)) column++;

        // Update total columns for all overlapping
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

    return positioned;
  }, [dayEvents, startHour, hourHeight]);

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Date Header */}
      <DateHeader startDate={date} numberOfDays={1} singleDay />

      {/* Scrollable Time Grid */}
      <ScrollArea className="flex-1">
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
                <EventCard
                  event={event}
                  onClick={() => onEventClick?.(event)}
                  variant="compact"
                  className="h-full"
                />
              </div>
            );
          })}
        </TimeGrid>
      </ScrollArea>
    </div>
  );
}
