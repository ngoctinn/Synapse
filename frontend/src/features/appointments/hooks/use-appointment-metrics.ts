"use client";

import { useEffect, useState, useTransition } from "react";
import { getAppointmentMetrics } from "../actions";
import type { AppointmentMetrics } from "../model/types";

/**
 * Hook to manage appointment metrics fetching and state.
 * Encapsulates the metric-related logic from the appointments page.
 */
export function useAppointmentMetrics(date: Date) {
  const [metrics, setMetrics] = useState<AppointmentMetrics | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchMetrics = () => {
    startTransition(async () => {
      const res = await getAppointmentMetrics(date);
      if (res.status === "success" && res.data) {
        setMetrics(res.data);
      }
    });
  };

  useEffect(() => {
    fetchMetrics();
  }, [date]);

  return {
    metrics,
    isPending,
    refreshMetrics: fetchMetrics,
  };
}
