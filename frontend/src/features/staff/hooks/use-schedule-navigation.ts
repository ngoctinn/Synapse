"use client";

import {
    addDays,
    addMonths,
    addWeeks,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    startOfMonth,
    startOfWeek,
    subMonths,
    subWeeks,
} from "date-fns";
import { vi } from "date-fns/locale";
import { useCallback, useMemo, useState } from "react";

import { DEFAULT_WEEK_START } from "../model/constants";
import { DateRange, ScheduleViewType } from "../model/types";

interface UseScheduleNavigationProps {
  initialDate?: Date;
  initialView?: ScheduleViewType;
}

/**
 * Hook quản lý điều hướng lịch (tuần/tháng)
 */
export function useScheduleNavigation({
  initialDate = new Date(),
  initialView = "week",
}: UseScheduleNavigationProps = {}) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [view, setView] = useState<ScheduleViewType>(initialView);

  // Tính toán date range dựa trên view
  const dateRange: DateRange = useMemo(() => {
    if (view === "week") {
      const start = startOfWeek(currentDate, { weekStartsOn: DEFAULT_WEEK_START });
      const end = endOfWeek(currentDate, { weekStartsOn: DEFAULT_WEEK_START });
      return { start, end };
    } else {
      // Month view - bao gồm cả ngày từ tuần trước/sau
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      const start = startOfWeek(monthStart, { weekStartsOn: DEFAULT_WEEK_START });
      const end = endOfWeek(monthEnd, { weekStartsOn: DEFAULT_WEEK_START });
      return { start, end };
    }
  }, [currentDate, view]);

  // Tạo mảng các ngày trong range
  const days = useMemo(() => {
    const result: Date[] = [];
    let day = dateRange.start;
    while (day <= dateRange.end) {
      result.push(day);
      day = addDays(day, 1);
    }
    return result;
  }, [dateRange]);

  // Tạo mảng 7 ngày trong tuần (cho week view)
  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: DEFAULT_WEEK_START });
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }, [currentDate]);

  // Format date range cho hiển thị
  const formattedDateRange = useMemo(() => {
    if (view === "week") {
      const start = format(dateRange.start, "dd/MM", { locale: vi });
      const end = format(dateRange.end, "dd/MM/yyyy", { locale: vi });
      return `${start} - ${end}`;
    } else {
      return format(currentDate, "MMMM yyyy", { locale: vi });
    }
  }, [currentDate, dateRange, view]);

  // Kiểm tra có phải đang xem hôm nay không
  const isToday = useMemo(() => {
    const today = new Date();
    if (view === "week") {
      return days.some((d) => isSameDay(d, today));
    } else {
      return (
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear()
      );
    }
  }, [currentDate, days, view]);

  // Navigation handlers
  const goToPrev = useCallback(() => {
    if (view === "week") {
      setCurrentDate((d) => subWeeks(d, 1));
    } else {
      setCurrentDate((d) => subMonths(d, 1));
    }
  }, [view]);

  const goToNext = useCallback(() => {
    if (view === "week") {
      setCurrentDate((d) => addWeeks(d, 1));
    } else {
      setCurrentDate((d) => addMonths(d, 1));
    }
  }, [view]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const goToDate = useCallback((date: Date) => {
    setCurrentDate(date);
  }, []);

  const changeView = useCallback((newView: ScheduleViewType) => {
    setView(newView);
  }, []);

  return {
    // State
    currentDate,
    view,
    dateRange,
    days,
    weekDays,
    formattedDateRange,
    isToday,

    // Actions
    goToPrev,
    goToNext,
    goToToday,
    goToDate,
    changeView,
  };
}
