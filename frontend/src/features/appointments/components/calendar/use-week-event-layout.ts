import { useMemo } from "react";
import { isSameDay } from "date-fns";
import type { CalendarEvent } from "../../types";
import { calculateEventLayout } from "./layout-utils";

interface UseWeekEventLayoutParams {
  weekDays: Date[];
  events: CalendarEvent[];
  startHour: number;
  hourHeight: number;
}

export function useWeekEventLayout({
  weekDays,
  events,
  startHour,
  hourHeight,
}: UseWeekEventLayoutParams) {
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

  // Position events with overlap handling
  const positionedEventsByDay = useMemo(() => {
    const result = new Map<
      string,
      ReturnType<typeof calculateEventLayout>
    >();

    for (const [dateKey, dayEvents] of eventsByDay) {
      const positioned = calculateEventLayout(dayEvents, startHour, hourHeight);
      result.set(dateKey, positioned);
    }

    return result;
  }, [eventsByDay, startHour, hourHeight]);

  return positionedEventsByDay;
}
