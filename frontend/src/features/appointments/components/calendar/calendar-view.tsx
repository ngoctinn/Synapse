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
  TimelineResource,
} from "../../types";

import { ResourceTimeline } from "../timeline";
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
  /** Danh sách nhân viên (cho Timeline) */
  staffList?: TimelineResource[];
  /** Danh sách phòng (cho Timeline) */
  roomList?: TimelineResource[];
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
  staffList = [],
  roomList = [],
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
      return (
        <ResourceTimeline
          date={date}
          events={events}
          staffList={staffList}
          roomList={roomList}
          onEventClick={onEventClick}
          className={className}
        />
      );

    default:
      return null;
  }
}
