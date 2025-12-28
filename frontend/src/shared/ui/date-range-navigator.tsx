"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateRangeNavigatorProps {
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  label?: string;
  className?: string;
}

/**
 * Bộ điều hướng ngày tháng năm: Trước | Hôm nay | Sau.
 * Thiết kế chuẩn Premium UI cho Synapse.
 */
export function DateRangeNavigator({
  onPrevious,
  onNext,
  onToday,
  label,
  className,
}: DateRangeNavigatorProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="border-border bg-background flex items-center rounded-lg border p-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md"
          onClick={onPrevious}
          title="Trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 rounded-md px-3 text-xs font-medium"
          onClick={onToday}
        >
          Hôm nay
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-md"
          onClick={onNext}
          title="Sau"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {label && (
        <span className="text-foreground ml-2 min-w-[120px] text-center text-sm font-semibold">
          {label}
        </span>
      )}
    </div>
  );
}
