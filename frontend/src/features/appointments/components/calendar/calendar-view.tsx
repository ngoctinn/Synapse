"use client";

/**
 * CalendarView - Router component chuyển đổi giữa các calendar views
 *
 * Switch giữa: Day, Week, Month, Agenda, Timeline
 */


import { cn } from "@/shared/lib/utils";

import type {
    CalendarEvent,
    CalendarViewType,
    DateRange,
    DensityMode,
} from "../../types";

import { AgendaView } from "./agenda-view";
import { DayView } from "./day-view";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";

// ============================================
// TYPES
// ============================================

interface CalendarViewProps {
  /** Loại view hiện tại */
  view: CalendarViewType;
  /** Ngày đang xem */
  date: Date;
  /** Khoảng thời gian được tính sẵn */
  dateRange: DateRange;
  /** Danh sách events */
  events: CalendarEvent[];
  /** Chế độ density */
  densityMode?: DensityMode;
  /** Callback khi click event */
  onEventClick?: (event: CalendarEvent) => void;
  /** Callback khi click slot trống */
  onSlotClick?: (date: Date, hour: number, minute: number) => void;
  /** Callback khi click ngày (trong Month view) */
  onDayClick?: (date: Date) => void;
  /** Loading state */
  isLoading?: boolean;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================

export function CalendarView({
  view,
  date,
  dateRange,
  events,
  densityMode = "comfortable",
  onEventClick,
  onSlotClick,
  onDayClick,
  isLoading = false,
  className,
}: CalendarViewProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted-foreground">Đang tải lịch hẹn...</span>
        </div>
      </div>
    );
  }

  // Render view based on type
  switch (view) {
    case "day":
      return (
        <DayView
          date={date}
          events={events}
          densityMode={densityMode}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
          className={className}
        />
      );

    case "week":
      return (
        <WeekView
          dateRange={dateRange}
          events={events}
          densityMode={densityMode}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
          className={className}
        />
      );

    case "month":
      return (
        <MonthView
          dateRange={dateRange}
          currentMonth={date}
          events={events}
          onEventClick={onEventClick}
          onDayClick={onDayClick}
          className={className}
        />
      );

    case "agenda":
      return (
        <AgendaView
          dateRange={dateRange}
          events={events}
          onEventClick={onEventClick}
          className={className}
        />
      );

    case "timeline":
      // Timeline sẽ được implement ở Giai đoạn 3
      return (
        <div className={cn("flex items-center justify-center h-full", className)}>
          <div className="text-center space-y-3 max-w-sm p-6">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <svg
                className="w-7 h-7 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold">Timeline View</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Xem lịch theo nhân viên và phòng. Đang phát triển...
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
