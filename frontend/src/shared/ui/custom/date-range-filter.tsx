"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover";
import {
    addMonths,
    addWeeks,
    endOfDay,
    endOfMonth,
    endOfWeek,
    endOfYear,
    format,
    isSameDay,
    startOfDay,
    startOfMonth,
    startOfWeek,
    startOfYear,
    subDays,
} from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

interface DateRangeFilterProps {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  className?: string;
}

export function DateRangeFilter({
  dateRange,
  setDateRange,
  className,
}: DateRangeFilterProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
  const [showCalendar, setShowCalendar] = React.useState(false);

  // Reset view when popover closes
  React.useEffect(() => {
    if (!isPopoverOpen) {
      setShowCalendar(false);
    }
  }, [isPopoverOpen]);

  const handlePresetChange = (value: string) => {
    const now = new Date();
    if (value === "all") {
      setDateRange(undefined);
      setIsPopoverOpen(false);
      return;
    }

    let from: Date | undefined;
    let to: Date | undefined;

    switch (value) {
      case "today":
        from = startOfDay(now);
        to = endOfDay(now);
        break;
      case "yesterday":
        const yesterday = subDays(now, 1);
        from = startOfDay(yesterday);
        to = endOfDay(yesterday);
        break;
      case "this_week":
        from = startOfWeek(now, { locale: vi });
        to = endOfWeek(now, { locale: vi });
        break;
      case "next_week":
        const nextWeek = addWeeks(now, 1);
        from = startOfWeek(nextWeek, { locale: vi });
        to = endOfWeek(nextWeek, { locale: vi });
        break;
      case "this_month":
        from = startOfMonth(now);
        to = endOfMonth(now);
        break;
      case "next_month":
        const nextMonth = addMonths(now, 1);
        from = startOfMonth(nextMonth);
        to = endOfMonth(nextMonth);
        break;
      case "this_year":
        from = startOfYear(now);
        to = endOfYear(now);
        break;
    }

    if (from && to) {
      setDateRange({ from, to });
      setIsPopoverOpen(false);
    }
  };

  const getPresetValue = () => {
    if (!dateRange || !dateRange.from || !dateRange.to) return "all";

    const now = new Date();
    const { from, to } = dateRange;

    // Helper to check range
    const isRange = (start: Date, end: Date) =>
      isSameDay(from, start) && isSameDay(to, end);

    if (isRange(startOfDay(now), endOfDay(now))) return "today";
    if (isRange(startOfDay(subDays(now, 1)), endOfDay(subDays(now, 1))))
      return "yesterday";

    if (
      isRange(
        startOfWeek(now, { locale: vi }),
        endOfWeek(now, { locale: vi })
      )
    )
      return "this_week";
    if (
      isRange(
        startOfWeek(addWeeks(now, 1), { locale: vi }),
        endOfWeek(addWeeks(now, 1), { locale: vi })
      )
    )
      return "next_week";
    if (isRange(startOfMonth(now), endOfMonth(now))) return "this_month";
    if (
      isRange(
        startOfMonth(addMonths(now, 1)),
        endOfMonth(addMonths(now, 1))
      )
    )
      return "next_month";
    if (isRange(startOfYear(now), endOfYear(now))) return "this_year";

    return undefined; // Custom or unmatched
  };

  const getTriggerLabel = () => {
    const preset = getPresetValue();
    switch (preset) {
      case "all":
        return "Toàn thời gian";
      case "today":
        return "Hôm nay";
      case "yesterday":
        return "Hôm qua";
      case "this_week":
        return "Tuần này";
      case "next_week":
        return "Tuần tới";
      case "this_month":
        return "Tháng này";
      case "next_month":
        return "Tháng sau";
      case "this_year":
        return "Năm nay";
      default:
        if (dateRange?.from) {
          if (dateRange.to) {
            return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(
              dateRange.to,
              "dd/MM/yyyy"
            )}`;
          }
          return format(dateRange.from, "dd/MM/yyyy");
        }
        return "Chọn thời gian";
    }
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full h-9 justify-start text-left font-normal transition-colors hover:border-primary/50",
            !dateRange && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 shrink-0 text-muted-foreground/70" />
          <span className="truncate">{getTriggerLabel()}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {!showCalendar ? (
          <div className="flex flex-col p-1 min-w-[180px] gap-0.5">
            <Button
              variant="ghost"
              className="justify-start font-normal h-8 px-2 data-[state=active]:bg-accent"
              onClick={() => handlePresetChange("all")}
            >
              Toàn thời gian
            </Button>
            <div className="h-[1px] bg-border/50 my-1 mx-2" />
            <Button
              variant="ghost"
              className="justify-start font-normal h-8 px-2"
              onClick={() => handlePresetChange("today")}
            >
              Hôm nay
            </Button>
            <Button
              variant="ghost"
              className="justify-start font-normal h-8 px-2"
              onClick={() => handlePresetChange("yesterday")}
            >
              Hôm qua
            </Button>
            <Button
              variant="ghost"
              className="justify-start font-normal h-8 px-2"
              onClick={() => handlePresetChange("this_week")}
            >
              Tuần này
            </Button>
            <Button
              variant="ghost"
              className="justify-start font-normal h-8 px-2"
              onClick={() => handlePresetChange("next_week")}
            >
              Tuần tới
            </Button>
            <Button
              variant="ghost"
              className="justify-start font-normal h-8 px-2"
              onClick={() => handlePresetChange("this_month")}
            >
              Tháng này
            </Button>
            <Button
              variant="ghost"
              className="justify-start font-normal h-8 px-2"
              onClick={() => handlePresetChange("next_month")}
            >
              Tháng sau
            </Button>
            <Button
              variant="ghost"
              className="justify-start font-normal h-8 px-2"
              onClick={() => handlePresetChange("this_year")}
            >
              Năm nay
            </Button>
            <div className="h-[1px] bg-border/50 my-1 mx-2" />
            <Button
              variant="ghost"
              className="justify-between font-normal h-8 px-2 text-primary hover:text-primary transition-colors group"
              onClick={() => setShowCalendar(true)}
            >
              Tùy chọn...
              <ChevronRight className="h-4 w-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </div>
        ) : (
          <div className="p-2">
            <div className="flex items-center gap-1 mb-2 pb-2 border-b border-border/50">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowCalendar(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">Chọn ngày</span>
            </div>
            <Calendar
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={1}
              locale={vi}
              initialFocus
              classNames={{
                day_selected:
                  "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
              }}
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
