"use client";

import { cn } from "@/shared/lib/utils";
import { ScrollArea, ScrollBar } from "@/shared/ui/scroll-area";
import { addDays, format, isSameDay, isToday } from "date-fns";
import { vi } from "date-fns/locale";
import { useHasHydrated } from "@/shared/hooks";
import React, { useEffect, useRef } from "react";

interface DatePickerProps {
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  availableDates: Date[]; // Dates for which slots are available
  isLoading?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selectedDate,
  onSelectDate,
  availableDates,
  isLoading,
}) => {
  const hasHydrated = useHasHydrated();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const selectedDateRef = useRef<HTMLButtonElement>(null);

  const datesToShow = React.useMemo(() => {
    const dates = [];
    for (let i = 0; i < 30; i++) {
      // Show 30 days from today
      dates.push(addDays(new Date(), i));
    }
    return dates;
  }, []);

  useEffect(() => {
    if (selectedDateRef.current && scrollAreaRef.current) {
      selectedDateRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [selectedDate]);

  if (!hasHydrated)
    return (
      <div className="bg-muted h-20 w-full animate-pulse rounded-lg border" />
    );

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
      <div className="flex w-max space-x-2 p-2" ref={scrollAreaRef}>
        {datesToShow.map((date, index) => {
          const formattedDay = format(date, "EEE", { locale: vi }); // Mon, Tue
          const formattedDate = format(date, "dd/MM"); // 01/12
          const isDateAvailable = availableDates.some((d) =>
            isSameDay(d, date)
          );
          const isSelected = selectedDate
            ? isSameDay(selectedDate, date)
            : false;
          const today = isToday(date);

          return (
            <button
              key={index}
              ref={isSelected ? selectedDateRef : null}
              className={cn(
                "flex min-w-[4.5rem] flex-col items-center justify-center rounded-lg p-2",
                "text-sm font-medium transition-colors duration-150",
                "hover:bg-accent hover:text-accent-foreground",
                "focus:ring-primary focus:outline-none focus:ring-2 focus:ring-offset-2",
                today && "border-primary border",
                !isDateAvailable && "cursor-not-allowed opacity-50",
                isSelected &&
                  "bg-primary text-primary-foreground hover:bg-primary/90",
                isLoading && "animate-pulse"
              )}
              onClick={() => onSelectDate(date)}
              disabled={!isDateAvailable || isLoading}
            >
              <span className="capitalize">
                {today ? "Hôm nay" : formattedDay}
              </span>
              <span className="text-muted-foreground text-xs">
                {formattedDate}
              </span>
            </button>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
