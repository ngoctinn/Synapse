"use client";

/**
 * DayRow - Component hiển thị và chỉnh sửa lịch 1 ngày
 * [REFACTORED] Simplified UX/UI: Removed complex copy/paste visual effects
 */

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Switch } from "@/shared/ui/switch";
import { TimePicker } from "@/shared/ui/time-picker";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { AlertTriangle, Clipboard, Copy, Plus, X } from "lucide-react";
import { useMemo } from "react";
import {
  DEFAULT_CLOSE_TIME,
  DEFAULT_OPEN_TIME,
  validateTimeSlots,
} from "./constants";
import { DaySchedule, TimeSlot } from "./types";

interface DayRowProps {
  day: DaySchedule;
  onChange: (day: DaySchedule) => void;
  onCopy: () => void;
  onPaste?: () => void;
  onCancelCopy?: () => void;
  isCopySource?: boolean;
  isPasteTarget?: boolean;
}

export function DayRow({
  day,
  onChange,
  onCopy,
  onPaste,
  onCancelCopy,
  isCopySource,
  isPasteTarget,
}: DayRowProps) {
  // Validate time slots for overlap
  const validation = useMemo(() => {
    if (!day.isOpen || day.timeSlots.length === 0) {
      return {
        isValid: true,
        errors: [],
        invalidSlotIndexes: [],
        overlappingPairs: [],
      };
    }
    return validateTimeSlots(day.timeSlots);
  }, [day.isOpen, day.timeSlots]);

  const isSlotOverlapping = (index: number) => {
    return validation.overlappingPairs.some(
      ([i, j]: [number, number]) => i === index || j === index
    );
  };

  const handleToggle = (checked: boolean) => {
    onChange({
      ...day,
      isOpen: checked,
      timeSlots:
        checked && day.timeSlots.length === 0
          ? [{ start: DEFAULT_OPEN_TIME, end: DEFAULT_CLOSE_TIME }]
          : day.timeSlots,
    });
  };

  const updateSlot = (index: number, field: "start" | "end", value: string) => {
    const newSlots = [...day.timeSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    onChange({ ...day, timeSlots: newSlots });
  };

  const addSlot = () => {
    const lastSlot = day.timeSlots[day.timeSlots.length - 1];
    const newSlot: TimeSlot = lastSlot
      ? { start: lastSlot.end, end: DEFAULT_CLOSE_TIME }
      : { start: DEFAULT_OPEN_TIME, end: DEFAULT_CLOSE_TIME };
    onChange({ ...day, timeSlots: [...day.timeSlots, newSlot] });
  };

  const removeSlot = (index: number) => {
    if (day.timeSlots.length <= 1) return;
    const newSlots = day.timeSlots.filter((_, i) => i !== index);
    onChange({ ...day, timeSlots: newSlots });
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "flex flex-col items-start gap-4 rounded-lg border p-4 transition-all sm:flex-row sm:items-center",
          isCopySource
            ? "bg-primary/5 border-primary ring-primary ring-[1.5px]"
            : "bg-card hover:border-sidebar-accent",
          !day.isOpen && !isCopySource && "bg-muted/20 opacity-80"
        )}
      >
        {/* Toggle & Label */}
        <div className="flex w-32 shrink-0 items-center gap-3">
          <Switch
            checked={day.isOpen}
            onCheckedChange={handleToggle}
            id={`switch-${day.dayOfWeek}`}
            className="data-[state=checked]:bg-primary" // Ensure styling
          />
          <label
            htmlFor={`switch-${day.dayOfWeek}`}
            className={cn(
              "cursor-pointer select-none text-sm font-medium",
              day.isOpen ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {day.label}
          </label>
        </div>

        {/* Time Slots Area */}
        <div className="flex w-full flex-1 flex-col gap-2">
          {day.isOpen ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {day.timeSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <TimePicker
                      value={slot.start}
                      onChange={(val) => updateSlot(index, "start", val)}
                      className="h-8 w-28"
                    />
                    <span className="text-muted-foreground">-</span>
                    <TimePicker
                      value={slot.end}
                      onChange={(val) => updateSlot(index, "end", val)}
                      className="h-8 w-28"
                    />
                    {day.timeSlots.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => removeSlot(index)}
                      >
                        <X className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={addSlot}
                      className="text-primary hover:bg-primary/10 hover:text-primary size-8 rounded-full"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Thêm khung giờ (ca gãy)</TooltipContent>
                </Tooltip>
              </div>

              {/* Errors */}
              {!validation.isValid && (
                <div className="text-destructive mt-1 flex items-start gap-1.5 text-xs">
                  <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                  <span>{validation.errors.join(", ")}</span>
                </div>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground px-2 text-sm italic">
              Đóng cửa
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1 sm:ml-0">
          {isCopySource ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={onCancelCopy}
              className="hover:bg-muted/80 text-foreground h-8 text-xs"
            >
              <X className="mr-1.5 size-3.5" />
              Hủy
            </Button>
          ) : isPasteTarget ? (
            <Button
              variant="default"
              size="sm"
              onClick={onPaste}
              className="animate-in fade-in zoom-in-95 h-8 text-xs duration-200"
            >
              <Clipboard className="mr-1.5 size-3.5" />
              Dán
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCopy}
                  className="text-muted-foreground size-8"
                >
                  <Copy className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sao chép cấu hình</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
