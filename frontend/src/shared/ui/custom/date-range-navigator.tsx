"use client";

import { addDays, addMonths, addWeeks, endOfMonth, endOfWeek, format, isSameDay, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";

interface DateRangeNavigatorProps {
  /** Current value: can be a single Date (for day view) or DateRange (for week/month/range views) */
  value: Date | DateRange;

  /** Callback when date changes */
  onChange?: (value: Date | DateRange | undefined) => void;

  /**
   * View mode determines the step size for Prev/Next buttons
   * - day: +/- 1 day
   * - week: +/- 1 week
   * - month: +/- 1 month
   * - range: No automatic step logic (must provide onPrevClick/onNextClick)
   */
  mode?: "day" | "week" | "month" | "range";

  /** External handler for Previous button (overrides internal logic) */
  onPrevClick?: () => void;

  /** External handler for Next button (overrides internal logic) */
  onNextClick?: () => void;

  /** External handler for Today button (overrides internal logic) */
  onTodayClick?: () => void;

  /** Disable Next button if it goes beyond current date? */
  disableFuture?: boolean;

  className?: string;
}

/**
 * Premium Date Range Navigator
 * Follows UX/UI Best Practices:
 * - [ < ] [ Today ] [ > ] [ Icon + Range ]
 * - Supports Day, Week, Month context
 */
export function DateRangeNavigator({
  value,
  onChange,
  mode = "day",
  onPrevClick,
  onNextClick,
  onTodayClick,
  disableFuture = false,
  className,
}: DateRangeNavigatorProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  // Normalize value to handle potential undefined or Date types
  const currentDate = value instanceof Date ? value : (value?.from || new Date());
  const currentToDate = value instanceof Date ? value : (value?.to || value?.from || new Date());

  // Check if "Today" is active
  const today = startOfDay(new Date());
  const isTodayActive = React.useMemo(() => {
    if (value instanceof Date) {
      return isSameDay(value, today);
    }
    // For ranges, simplistic check if today is within range or range starts today
    // Better to check if range matches "Current Week" or "Current Month" logic?
    // Specification: "Không disable, kể cả khi đang ở 'hôm nay'" for button, so we just highlight it.
    // We'll highlight 'Today' button if the current view *contains* today?
    // SPEC: "Reset về current date range. Luôn hiển thị. Không disable."
    // Highlighting logic usually: IF current view is effectively representing "Today" or "This Week".
    if (value?.from) {
       return isSameDay(value.from, today); // Simple check for now
    }
    return false;
  }, [value, today]);

  // --- Handlers ---

  const handlePrev = () => {
    if (onPrevClick) {
      onPrevClick();
      return;
    }
    if (!onChange) return;

    if (value instanceof Date) {
      if (mode === "day") onChange(subDays(value, 1));
      else if (mode === "week") onChange(subWeeks(value, 1));
      else if (mode === "month") onChange(subMonths(value, 1));
    } else if (value?.from) {
      // Range logic: Shift range by step
      // Assuming straightforward shift based on mode
      const daysDiff = value.to ? Math.ceil((value.to.getTime() - value.from.getTime()) / (1000 * 60 * 60 * 24)) : 0;

      let newFrom, newTo;
      if (mode === "week") {
         newFrom = subWeeks(value.from, 1);
         newTo = value.to ? subWeeks(value.to, 1) : undefined;
      } else if (mode === "month") {
         newFrom = subMonths(value.from, 1);
         newTo = value.to ? subMonths(value.to, 1) : undefined;
      } else {
         // Default fallback or "day" mode on range? Just shift start?
         newFrom = subDays(value.from, 1);
         newTo = value.to ? subDays(value.to, 1) : undefined;
      }
      onChange({ from: newFrom, to: newTo });
    }
  };

  const handleNext = () => {
    if (onNextClick) {
      onNextClick();
      return;
    }
    if (!onChange) return;

    if (value instanceof Date) {
      if (mode === "day") onChange(addDays(value, 1));
      else if (mode === "week") onChange(addWeeks(value, 1));
      else if (mode === "month") onChange(addMonths(value, 1));
    } else if (value?.from) {
      let newFrom, newTo;
      if (mode === "week") {
         newFrom = addWeeks(value.from, 1);
         newTo = value.to ? addWeeks(value.to, 1) : undefined;
      } else if (mode === "month") {
         newFrom = addMonths(value.from, 1);
         newTo = value.to ? addMonths(value.to, 1) : undefined;
      } else {
         newFrom = addDays(value.from, 1);
         newTo = value.to ? addDays(value.to, 1) : undefined;
      }
      onChange({ from: newFrom, to: newTo });
    }
  };

  const handleToday = () => {
    if (onTodayClick) {
      onTodayClick();
      return;
    }
    if (!onChange) return;

    // Reset to "Today" based on mode
    const now = new Date();
    if (value instanceof Date) {
      onChange(now);
    } else {
      // For ranges, what is "Today"?
      // Usually "This Week" or "This Month" or just a range starting today?
      // Spec says: "Reset về current date range"
      // Without external logic, we can't guess "Current Week" start perfectly (Sunday/Monday?).
      // We will assume simpler logic: Set start to Today.
      // Ideally, the parent should handle `onTodayClick` for complex range logic (like 'start of week').
      onChange({ from: now, to: value?.to ? addDays(now, (value.to.getTime() - (value.from?.getTime() || 0))/(1000*3600*24)) : undefined });
    }
  };

  const handleCalendarSelect = (result: Date | DateRange | undefined) => {
    if (!onChange || !result) return;
    onChange(result);
    if (!(result instanceof Date && !('from' in result))) {
       // If range, maybe don't close immediately? Calendar closes on range complete usually?
       // Just keep open? Or close? Spec: "Click -> mở Date Range Picker".
       // existing code closes.
    }
    if (value instanceof Date) {
       setIsPopoverOpen(false);
    }
    // If range, we might want to keep it open until both dates picked?
    // Using default behavior of Calendar for now.
  };

  // --- Formatting ---

  const formattedText = React.useMemo(() => {
    if (value instanceof Date) {
      if (mode === "week") {
        const start = startOfWeek(value, { weekStartsOn: 1 });
        const end = endOfWeek(value, { weekStartsOn: 1 });
        return `${format(start, "dd/MM", { locale: vi })} – ${format(end, "dd/MM/yyyy", { locale: vi })}`;
      }
      if (mode === "month") {
        const start = startOfMonth(value);
        const end = endOfMonth(value);
        return `${format(start, "dd/MM", { locale: vi })} – ${format(end, "dd/MM/yyyy", { locale: vi })}`;
      }
      return format(value, "dd/MM/yyyy", { locale: vi });
    }
    if (value?.from) {
      const fromStr = format(value.from, "dd/MM/yyyy", { locale: vi });
      if (!value.to) return `${fromStr} - ...`;
      const toStr = format(value.to, "dd/MM/yyyy", { locale: vi });
      if (isSameDay(value.from, value.to)) return fromStr;
      return `${fromStr} - ${toStr}`;
    }
    return "Chọn ngày";
  }, [value, mode]);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Navigation Group */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-9 border-border/40 text-muted-foreground transition-colors hover:border-border hover:text-foreground sm:size-10"
          onClick={handlePrev}
          aria-label={mode === 'week' ? "Tuần trước" : mode === 'month' ? "Tháng trước" : "Ngày trước"}
        >
          <ChevronLeft className="size-[18px]" strokeWidth={1.5} />
        </Button>

        <Button
          variant="soft"
          size="sm"
          className="h-9 min-w-[80px] text-sm font-semibold shadow-sm sm:h-10 sm:px-4"
          onClick={handleToday}
        >
          Hôm nay
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="size-9 border-border/40 text-muted-foreground transition-colors hover:border-border hover:text-foreground sm:size-10"
          onClick={handleNext}
          disabled={disableFuture && (value instanceof Date ? isSameDay(value, today) : false)}
          aria-label={mode === 'week' ? "Tuần sau" : mode === 'month' ? "Tháng sau" : "Ngày sau"}
        >
          <ChevronRight className="size-[18px]" strokeWidth={1.5} />
        </Button>
      </div>

      {/* Divider */}
      <div className="mx-1 hidden h-6 w-px bg-border/40 sm:block" />

      {/* Date Range Display */}
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "text-foreground hover:text-primary h-9 gap-2.5 px-3 text-sm font-medium transition-colors sm:h-10 sm:px-4"
            )}
          >
            <CalendarIcon className="size-[18px] text-muted-foreground" strokeWidth={1.5} />
            <span>{formattedText}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {/* @ts-ignore: Dynamic mode typing issue with DayPicker */}
          <Calendar
            mode={value instanceof Date ? "single" : "range"}
            selected={value as any}
            onSelect={handleCalendarSelect as any}
            initialFocus
            locale={vi}
            weekStartsOn={1}
            numberOfMonths={mode === 'range' || mode === 'month' ? 2 : 1}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
