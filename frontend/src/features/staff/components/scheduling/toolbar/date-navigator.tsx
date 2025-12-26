"use client";

import { DateRangeNavigator } from "@/shared/ui";

interface DateNavigatorProps {
  date: Date;
  formattedDateRange?: string;
  isToday?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

/**
 * Wrapper for the standard DateRangeNavigator to ensure consistency.
 */
export function DateNavigator({
  date,
  onPrev,
  onNext,
  onToday,
  onDateSelect,
  className,
}: DateNavigatorProps) {
  return (
    <DateRangeNavigator
      value={date}
      mode="day"
      onPrevClick={onPrev}
      onNextClick={onNext}
      onTodayClick={onToday}
      onChange={(val) => {
        if (val instanceof Date) onDateSelect?.(val);
      }}
      className={className}
    />
  );
}
