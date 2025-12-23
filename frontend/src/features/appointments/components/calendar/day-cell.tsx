"use client";

import { format } from "date-fns";
import { vi } from "date-fns/locale";

import { cn } from "@/shared/lib/utils";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from "@/shared/ui";

import { MAX_EVENTS_IN_MONTH_CELL } from "../../constants";
import type { CalendarEvent } from "../../model/types";
import { EventCard } from "../event/event-card";

export interface DayModel {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  events: CalendarEvent[];
}

interface DayCellProps {
  data: DayModel;
  onEventClick?: (event: CalendarEvent) => void;
  onDayClick?: (date: Date) => void;
}

export function DayCell({ data, onEventClick, onDayClick }: DayCellProps) {
  const { date, isCurrentMonth, isToday, isWeekend, events } = data;

  const visibleEvents = events.slice(0, MAX_EVENTS_IN_MONTH_CELL);
  const hiddenCount = events.length - MAX_EVENTS_IN_MONTH_CELL;

  return (
    <div
      className={cn(
        "border-border/30 flex min-h-[80px] flex-col border-r p-1 last:border-r-0",
        !isCurrentMonth && "bg-muted/30",
        isWeekend && isCurrentMonth && "bg-muted/10",
        isToday && "bg-primary/5"
      )}
    >
      {/* Day Number */}
      <button
        type="button"
        onClick={() => onDayClick?.(date)}
        className={cn(
          "hover:bg-accent mb-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium transition-colors",
          !isCurrentMonth && "text-muted-foreground/50",
          isToday && "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        {format(date, "d")}
      </button>

      {/* Events List */}
      <div className="flex-1 space-y-0.5 overflow-hidden">
        {visibleEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            variant="mini"
            onClick={() => onEventClick?.(event)}
          />
        ))}

        {/* More Events Popover */}
        {hiddenCount > 0 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-5 w-full justify-start px-1.5 text-[10px]"
              >
                +{hiddenCount} thêm
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2" align="start">
              <div className="mb-2 text-sm font-medium">
                {format(date, "EEEE, d MMMM", { locale: vi })}
              </div>
              <ScrollArea className="max-h-48">
                <div className="space-y-1">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                      variant="compact"
                      onClick={() => onEventClick?.(event)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
