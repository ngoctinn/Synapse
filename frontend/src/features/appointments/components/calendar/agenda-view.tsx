"use client";

/**
 * AgendaView - Hiển thị lịch hẹn dạng danh sách theo ngày
 *
 * List view với sticky date headers, dễ đọc trên mobile.
 */

import { addDays, format, isSameDay, isToday as isTodayFn } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarOff } from "lucide-react";
import { useMemo } from "react";

import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/ui";

import { EMPTY_STATE_MESSAGES } from "../../constants";
import type { CalendarEvent, DateRange } from "../../types";
import { EventCard } from "../event/event-card";


interface AgendaViewProps {
  /** Khoảng thời gian hiển thị */
  dateRange: DateRange;
  /** Danh sách events */
  events: CalendarEvent[];
  /** Callback khi click event */
  onEventClick?: (event: CalendarEvent) => void;
  className?: string;
}

interface DayGroup {
  date: Date;
  isToday: boolean;
  events: CalendarEvent[];
}


export function AgendaView({
  dateRange,
  events,
  onEventClick,
  className,
}: AgendaViewProps) {
  // Group events by day
  const dayGroups = useMemo((): DayGroup[] => {
    const groups: DayGroup[] = [];
    let currentDay = dateRange.start;

    while (currentDay <= dateRange.end) {
      const dayEvents = events
        .filter((e) => isSameDay(e.start, currentDay))
        .sort((a, b) => a.start.getTime() - b.start.getTime());

      // Chỉ thêm ngày có events hoặc là ngày hôm nay
      const isToday = isTodayFn(currentDay);
      if (dayEvents.length > 0 || isToday) {
        groups.push({
          date: currentDay,
          isToday,
          events: dayEvents,
        });
      }

      currentDay = addDays(currentDay, 1);
    }

    return groups;
  }, [dateRange, events]);

  // No events state
  if (dayGroups.length === 0) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full p-8", className)}>
        <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
          <CalendarOff className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">{EMPTY_STATE_MESSAGES.noAppointments.title}</h3>
        <p className="text-sm text-muted-foreground text-center mt-1">
          {EMPTY_STATE_MESSAGES.noAppointments.description}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("h-full", className)}>
      <div className="divide-y divide-border/50">
        {dayGroups.map((group) => (
          <DayGroupSection
            key={group.date.toISOString()}
            group={group}
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

// DAY GROUP SUB-COMPONENT

interface DayGroupSectionProps {
  group: DayGroup;
  onEventClick?: (event: CalendarEvent) => void;
}

function DayGroupSection({ group, onEventClick }: DayGroupSectionProps) {
  const { date, isToday, events } = group;

  return (
    <div className="relative">
      {/* Sticky Date Header */}
      <div
        className={cn(
          "sticky top-0 z-10 px-4 py-2",
          "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
          "border-b border-border/30",
          isToday && "bg-primary/5"
        )}
      >
        <div className="flex items-center gap-3">
          {/* Day Number Circle */}
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
              isToday
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            )}
          >
            {format(date, "d")}
          </div>

          {/* Day Info */}
          <div className="flex flex-col">
            <span className={cn("text-sm font-medium", isToday && "text-primary")}>
              {isToday ? "Hôm nay" : format(date, "EEEE", { locale: vi })}
            </span>
            <span className="text-xs text-muted-foreground">
              {format(date, "d MMMM, yyyy", { locale: vi })}
            </span>
          </div>

          {/* Event Count */}
          {events.length > 0 && (
            <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
              {events.length} lịch hẹn
            </span>
          )}
        </div>
      </div>

      {/* Events List */}
      <div className="p-4 space-y-2">
        {events.length === 0 ? (
          <div className="text-sm text-muted-foreground py-4 text-center italic">
            Không có lịch hẹn
          </div>
        ) : (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              variant="default"
              onClick={() => onEventClick?.(event)}
            />
          ))
        )}
      </div>
    </div>
  );
}
