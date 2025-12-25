"use client";

import { cn } from "@/shared/lib/utils";
import type {
  CalendarEvent,
  CalendarViewType,
  DateRange,
  DensityMode,
  TimelineResource,
} from "../../model/types";

import { ResourceTimeline } from "../timeline";
import { AgendaView } from "./agenda-view";
import { DayView } from "./day-view";
import { MonthView } from "./month-view";
import { WeekView } from "./week-view";

interface CalendarViewProps {
  view: CalendarViewType;
  date: Date;
  dateRange: DateRange;
  events: CalendarEvent[];
  densityMode?: DensityMode;
  staffList?: TimelineResource[];
  bedList?: TimelineResource[];
  onEventClick?: (event: CalendarEvent) => void;
  onSlotClick?: (date: Date, hour: number, minute: number) => void;
  onDayClick?: (date: Date) => void;
  isLoading?: boolean;
  className?: string;
  onCheckIn?: (event: CalendarEvent) => void;
  onNoShow?: (event: CalendarEvent) => void;
  onCancel?: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
  onEdit?: (event: CalendarEvent) => void;
}

export function CalendarView({
  view,
  date,
  dateRange,
  events,
  densityMode = "comfortable",
  staffList = [],
  bedList = [],
  onEventClick,
  onSlotClick,
  onDayClick,
  isLoading = false,
  className,
  onCheckIn,
  onNoShow,
  onCancel,
  onDelete,
  onEdit,
}: CalendarViewProps) {
  if (isLoading) {
    return (
      <div className={cn("flex h-full items-center justify-center", className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          <span className="text-muted-foreground text-sm">
            Đang tải lịch hẹn...
          </span>
        </div>
      </div>
    );
  }

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
          onCheckIn={onCheckIn}
          onNoShow={onNoShow}
          onCancel={onCancel}
          onDelete={onDelete}
          onEdit={onEdit}
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
          onCheckIn={onCheckIn}
          onNoShow={onNoShow}
          onCancel={onCancel}
          onDelete={onDelete}
          onEdit={onEdit}
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
          bedList={bedList}
          onEventClick={onEventClick}
          className={className}
        />
      );

    default:
      return null;
  }
}
