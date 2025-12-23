"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { TimePicker } from "@/shared/ui/custom/time-picker";
import { Trash2 } from "lucide-react";

interface TimeRangeInputProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onRemove?: () => void;
  className?: string;
  showRemoveButton?: boolean;
  /** Hiển thị warning style khi slot này overlap với slot khác */
  hasOverlap?: boolean;
}

export function TimeRangeInput({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onRemove,
  className,
  showRemoveButton = true,
  hasOverlap = false,
}: TimeRangeInputProps) {
  // Simple string comparison works for "HH:mm" format (e.g. "09:00" < "13:00")
  const isInvalid = startTime >= endTime;
  const hasError = isInvalid || hasOverlap;

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md border p-1 transition-colors",
        hasError
          ? "border-destructive/50 bg-destructive/5"
          : "border-border hover:border-primary/50",
        hasOverlap && !isInvalid && "border-warning/50 bg-warning/5",
        className
      )}
    >
      <TimePicker
        value={startTime}
        onChange={onStartTimeChange}
        hasError={hasError}
        className="w-[100px] border-none bg-transparent px-0 text-center text-sm font-medium shadow-none focus:ring-0"
      />

      <span
        className={cn(
          "text-sm",
          hasError ? "text-destructive/50" : "text-muted-foreground/50"
        )}
      >
        -
      </span>

      <TimePicker
        value={endTime}
        onChange={onEndTimeChange}
        hasError={hasError}
        className="w-[100px] border-none bg-transparent px-0 text-center text-right text-sm font-medium shadow-none focus:ring-0"
      />

      {showRemoveButton && onRemove && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className={cn(
            "ml-1 size-6 shrink-0 rounded-full",
            "hover:bg-destructive/10 hover:text-destructive text-muted-foreground",
            hasError && "text-destructive/70"
          )}
          title="Xóa khung giờ"
        >
          <Trash2 className="size-3.5" />
        </Button>
      )}
    </div>
  );
}
