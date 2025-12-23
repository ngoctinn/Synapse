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
import type { CalendarEvent, DateRange } from "../../model/types";
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
      <div
        className={cn(
          "flex h-full flex-col items-center justify-center p-8",
          className
        )}
      >
        <div className="bg-muted/50 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          <CalendarOff className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold">
          {EMPTY_STATE_MESSAGES.noAppointments.title}
        </h3>
        <p className="text-muted-foreground mt-1 text-center text-sm">
          {EMPTY_STATE_MESSAGES.noAppointments.description}
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className={cn("h-full", className)}>
      <div className="divide-border/50 divide-y">
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
          "bg-background/95 supports-[backdrop-filter]:bg-background/80 backdrop-blur",
          "border-border/30 border-b",
          isToday && "bg-primary/5"
        )}
      >
        <div className="flex items-center gap-3">
          {/* Day Number Circle */}
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold",
              isToday
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            )}
          >
            {format(date, "d")}
          </div>

          {/* Day Info */}
          <div className="flex flex-col">
            <span
              className={cn("text-sm font-medium", isToday && "text-primary")}
            >
              {isToday ? "Hôm nay" : format(date, "EEEE", { locale: vi })}
            </span>
            <span className="text-muted-foreground text-xs">
              {format(date, "d MMMM, yyyy", { locale: vi })}
            </span>
          </div>

          {/* Event Count */}
          {events.length > 0 && (
            <span className="text-muted-foreground bg-muted ml-auto rounded-full px-2 py-0.5 text-xs">
              {events.length} lịch hẹn
            </span>
          )}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-2 p-4">
        {events.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center text-sm italic">
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
