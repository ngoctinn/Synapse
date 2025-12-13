"use client";

import {
    addDays,
    addMonths,
    addWeeks,
    endOfDay,
    endOfMonth,
    endOfWeek,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subDays,
    subMonths,
    subWeeks,
} from "date-fns";
import { useCallback, useMemo, useState } from "react";
import type {
    CalendarViewType,
    DateRange,
    DensityMode,
    ZoomLevel,
} from "../types";

interface UseCalendarStateOptions {
  initialView?: CalendarViewType;
  initialDate?: Date;
  initialZoom?: ZoomLevel;
  initialDensity?: DensityMode;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sun, 1 = Mon
}

interface UseCalendarStateReturn {
  view: CalendarViewType;
  date: Date;
  zoomLevel: ZoomLevel;
  densityMode: DensityMode;
  dateRange: DateRange;
  formattedDateRange: string;
  isToday: boolean;
  setView: (view: CalendarViewType) => void;
  setDate: (date: Date) => void;
  goToday: () => void;
  goNext: () => void;
  goPrev: () => void;
  goToDate: (date: Date) => void;
  setZoomLevel: (zoom: ZoomLevel) => void;
  setDensityMode: (mode: DensityMode) => void;
}

export function useCalendarState(
  options: UseCalendarStateOptions = {}
): UseCalendarStateReturn {
  const {
    initialView = "week",
    initialDate = new Date(),
    initialZoom = 30,
    initialDensity = "comfortable",
    weekStartsOn = 1,
  } = options;

  const [view, setView] = useState<CalendarViewType>(initialView);
  const [date, setDate] = useState<Date>(initialDate);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(initialZoom);
  const [densityMode, setDensityMode] = useState<DensityMode>(initialDensity);

  const dateRange = useMemo((): DateRange => {
    switch (view) {
      case "day":
      case "timeline":
        return { start: startOfDay(date), end: endOfDay(date) };
      case "week":
        return {
          start: startOfWeek(date, { weekStartsOn }),
          end: endOfWeek(date, { weekStartsOn }),
        };
      case "month":
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        return {
          start: startOfWeek(monthStart, { weekStartsOn }),
          end: endOfWeek(monthEnd, { weekStartsOn }),
        };
      case "agenda":
        return { start: startOfDay(date), end: endOfDay(addDays(date, 13)) };
      default:
        return { start: startOfDay(date), end: endOfDay(date) };
    }
  }, [view, date, weekStartsOn]);

  const formattedDateRange = useMemo((): string => {
    const formatOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    switch (view) {
      case "day":
      case "timeline":
        return date.toLocaleDateString("vi-VN", {
          weekday: "long",
          ...formatOptions,
        });

      case "week": {
        const weekStart = startOfWeek(date, { weekStartsOn });
        const weekEnd = endOfWeek(date, { weekStartsOn });

        if (weekStart.getMonth() === weekEnd.getMonth()) {
          return `${weekStart.getDate()} - ${weekEnd.getDate()} tháng ${weekEnd.getMonth() + 1}, ${weekEnd.getFullYear()}`;
        }
        return `${weekStart.getDate()} tháng ${weekStart.getMonth() + 1} - ${weekEnd.getDate()} tháng ${weekEnd.getMonth() + 1}, ${weekEnd.getFullYear()}`;
      }

      case "month":
        return date.toLocaleDateString("vi-VN", {
          month: "long",
          year: "numeric",
        });

      case "agenda":
        return `Từ ${date.toLocaleDateString("vi-VN")} - ${addDays(date, 13).toLocaleDateString("vi-VN")}`;

      default:
        return date.toLocaleDateString("vi-VN", formatOptions);
    }
  }, [view, date, weekStartsOn]);

  const isToday = useMemo((): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, [date]);

  const goToday = useCallback(() => setDate(new Date()), []);

  const goNext = useCallback(() => {
    const actions: Record<string, (d: Date, i: number) => Date> = {
      day: addDays,
      timeline: addDays,
      week: addWeeks,
      month: addMonths,
      agenda: (d) => addDays(d, 14),
    };
    const action = actions[view] || addDays;
    setDate((prev) => action(prev, 1));
  }, [view]);

  const goPrev = useCallback(() => {
    const actions: Record<string, (d: Date, i: number) => Date> = {
      day: subDays,
      timeline: subDays,
      week: subWeeks,
      month: subMonths,
      agenda: (d) => subDays(d, 14),
    };
    const action = actions[view] || subDays;
    setDate((prev) => action(prev, 1));
  }, [view]);

  const goToDate = useCallback((newDate: Date) => setDate(newDate), []);

  return {
    view,
    date,
    zoomLevel,
    densityMode,
    dateRange,
    formattedDateRange,
    isToday,
    setView,
    setDate,
    goToday,
    goNext,
    goPrev,
    goToDate,
    setZoomLevel,
    setDensityMode,
  };
}
