"use client";

import { useCallback, useEffect, useState, useTransition, useOptimistic } from "react";
import { getAppointments } from "../actions";
import type { CalendarEvent, AppointmentFilters, DateRange, AppointmentStatus } from "../model/types";

export type OptimisticAction =
  | { type: "delete"; id: string }
  | { type: "update_status"; id: string; status: AppointmentStatus };

interface UseAppointmentEventsProps {
  dateRange: DateRange;
  filters: Partial<AppointmentFilters>;
  initialEvents: CalendarEvent[];
  onRefreshMetrics?: () => void;
}

/**
 * Hook to manage appointment events fetching, refreshing, and state.
 */
export function useAppointmentEvents({
  dateRange,
  filters,
  initialEvents,
  onRefreshMetrics,
}: UseAppointmentEventsProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isPending, startTransition] = useTransition();

  // Optimistic UI state
  const [optimisticEvents, addOptimisticEvent] = useOptimistic(
    events,
    (state: CalendarEvent[], action: OptimisticAction) => {
      switch (action.type) {
        case "delete":
          return state.filter((e) => e.id !== action.id);
        case "update_status":
          return state.map((e) =>
            e.id === action.id
              ? {
                  ...e,
                  status: action.status,
                  appointment: { ...e.appointment, status: action.status },
                }
              : e
          );
        default:
          return state;
      }
    }
  );

  const handleRefresh = useCallback(() => {
    startTransition(async () => {
      const result = await getAppointments(dateRange, filters);
      if (result.status === "success" && result.data) {
        setEvents(result.data);
      }

      // Trigger metrics refresh if callback provided
      if (onRefreshMetrics) {
        onRefreshMetrics();
      }
    });
  }, [dateRange, filters, onRefreshMetrics]);

  // Auto-refresh when filters or dateRange change
  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  return {
    events: optimisticEvents, // Return optimistic events for the UI
    isPending,
    setEvents,
    addOptimisticEvent,
    refreshEvents: handleRefresh,
  };
}
