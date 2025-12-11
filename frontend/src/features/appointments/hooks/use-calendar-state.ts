"use client";

/**
 * useCalendarState - Hook quản lý state của Calendar
 *
 * Quản lý: view hiện tại, ngày đang xem, zoom level, density mode.
 * Cung cấp: actions để navigate, computed dateRange.
 */

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

// ============================================
// TYPES
// ============================================

interface UseCalendarStateOptions {
  initialView?: CalendarViewType;
  initialDate?: Date;
  initialZoom?: ZoomLevel;
  initialDensity?: DensityMode;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = CN, 1 = T2
}

interface UseCalendarStateReturn {
  // State
  view: CalendarViewType;
  date: Date;
  zoomLevel: ZoomLevel;
  densityMode: DensityMode;

  // Computed
  dateRange: DateRange;
  formattedDateRange: string;
  isToday: boolean;

  // Actions - View
  setView: (view: CalendarViewType) => void;

  // Actions - Navigation
  setDate: (date: Date) => void;
  goToday: () => void;
  goNext: () => void;
  goPrev: () => void;
  goToDate: (date: Date) => void;

  // Actions - Zoom & Density
  setZoomLevel: (zoom: ZoomLevel) => void;
  setDensityMode: (mode: DensityMode) => void;
}

// ============================================
// HOOK
// ============================================

export function useCalendarState(
  options: UseCalendarStateOptions = {}
): UseCalendarStateReturn {
  const {
    initialView = "week",
    initialDate = new Date(),
    initialZoom = 30,
    initialDensity = "comfortable",
    weekStartsOn = 1, // Mặc định bắt đầu từ Thứ 2
  } = options;

  // ============================================
  // STATE
  // ============================================

  const [view, setView] = useState<CalendarViewType>(initialView);
  const [date, setDate] = useState<Date>(initialDate);
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(initialZoom);
  const [densityMode, setDensityMode] = useState<DensityMode>(initialDensity);

  // ============================================
  // COMPUTED: Date Range
  // ============================================

  const dateRange = useMemo((): DateRange => {
    switch (view) {
      case "day":
        return {
          start: startOfDay(date),
          end: endOfDay(date),
        };

      case "week":
        return {
          start: startOfWeek(date, { weekStartsOn }),
          end: endOfWeek(date, { weekStartsOn }),
        };

      case "month":
        // Month view cần thêm ngày của tuần trước/sau
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(date);
        return {
          start: startOfWeek(monthStart, { weekStartsOn }),
          end: endOfWeek(monthEnd, { weekStartsOn }),
        };

      case "agenda":
        // Agenda: 14 ngày từ ngày hiện tại
        return {
          start: startOfDay(date),
          end: endOfDay(addDays(date, 13)),
        };

      case "timeline":
        // Timeline: Giống day view nhưng theo giờ làm việc
        return {
          start: startOfDay(date),
          end: endOfDay(date),
        };

      default:
        return {
          start: startOfDay(date),
          end: endOfDay(date),
        };
    }
  }, [view, date, weekStartsOn]);

  // ============================================
  // COMPUTED: Formatted Date Range (Tiếng Việt)
  // ============================================

  const formattedDateRange = useMemo((): string => {
    const formatOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    switch (view) {
      case "day":
      case "timeline":
        // "Thứ Hai, 11 tháng 12, 2024"
        return date.toLocaleDateString("vi-VN", {
          weekday: "long",
          ...formatOptions,
        });

      case "week": {
        // "11 - 17 tháng 12, 2024"
        const weekStart = startOfWeek(date, { weekStartsOn });
        const weekEnd = endOfWeek(date, { weekStartsOn });

        if (weekStart.getMonth() === weekEnd.getMonth()) {
          return `${weekStart.getDate()} - ${weekEnd.getDate()} tháng ${weekEnd.getMonth() + 1}, ${weekEnd.getFullYear()}`;
        }
        // Nếu tuần nằm giữa 2 tháng
        return `${weekStart.getDate()} tháng ${weekStart.getMonth() + 1} - ${weekEnd.getDate()} tháng ${weekEnd.getMonth() + 1}, ${weekEnd.getFullYear()}`;
      }

      case "month":
        // "Tháng 12, 2024"
        return date.toLocaleDateString("vi-VN", {
          month: "long",
          year: "numeric",
        });

      case "agenda":
        // "Từ 11/12 - 24/12/2024"
        return `Từ ${date.toLocaleDateString("vi-VN")} - ${addDays(date, 13).toLocaleDateString("vi-VN")}`;

      default:
        return date.toLocaleDateString("vi-VN", formatOptions);
    }
  }, [view, date, weekStartsOn]);

  // ============================================
  // COMPUTED: Is Today
  // ============================================

  const isToday = useMemo((): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }, [date]);

  // ============================================
  // ACTIONS: Navigation
  // ============================================

  const goToday = useCallback(() => {
    setDate(new Date());
  }, []);

  const goNext = useCallback(() => {
    switch (view) {
      case "day":
      case "timeline":
        setDate((prev) => addDays(prev, 1));
        break;
      case "week":
        setDate((prev) => addWeeks(prev, 1));
        break;
      case "month":
        setDate((prev) => addMonths(prev, 1));
        break;
      case "agenda":
        setDate((prev) => addDays(prev, 14));
        break;
    }
  }, [view]);

  const goPrev = useCallback(() => {
    switch (view) {
      case "day":
      case "timeline":
        setDate((prev) => subDays(prev, 1));
        break;
      case "week":
        setDate((prev) => subWeeks(prev, 1));
        break;
      case "month":
        setDate((prev) => subMonths(prev, 1));
        break;
      case "agenda":
        setDate((prev) => subDays(prev, 14));
        break;
    }
  }, [view]);

  const goToDate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    view,
    date,
    zoomLevel,
    densityMode,

    // Computed
    dateRange,
    formattedDateRange,
    isToday,

    // Actions
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
