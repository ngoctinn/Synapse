  "use client";

/**
 * DayRow - Component hiển thị và chỉnh sửa lịch 1 ngày
 * [REFACTORED] Simplified UX/UI: Removed complex copy/paste visual effects
 */

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { TimeRangeInput } from "@/shared/ui/custom/time-range-input";
import { Switch } from "@/shared/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { AlertTriangle, Clipboard, Copy, Plus, X } from "lucide-react";
import { useMemo } from "react";
import { DEFAULT_CLOSE_TIME, DEFAULT_OPEN_TIME, validateTimeSlots } from "./constants";
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
      return { isValid: true, errors: [], invalidSlotIndexes: [], overlappingPairs: [] };
    }
    return validateTimeSlots(day.timeSlots);
  }, [day.isOpen, day.timeSlots]);

  const isSlotOverlapping = (index: number) => {
    return validation.overlappingPairs.some(([i, j]: [number, number]) => i === index || j === index);
  };

  const handleToggle = (checked: boolean) => {
    onChange({
      ...day,
      isOpen: checked,
      timeSlots: checked && day.timeSlots.length === 0
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
          "flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border transition-all",
          isCopySource
            ? "bg-primary/5 border-primary ring-1 ring-primary"
            : "bg-card hover:border-sidebar-accent",
            !day.isOpen && !isCopySource && "bg-muted/20 opacity-80"
        )}
      >
        {/* Toggle & Label */}
        <div className="flex items-center gap-3 w-32 shrink-0">
          <Switch
            checked={day.isOpen}
            onCheckedChange={handleToggle}
            id={`switch-${day.dayOfWeek}`}
            className="data-[state=checked]:bg-primary" // Ensure styling
          />
          <label
            htmlFor={`switch-${day.dayOfWeek}`}
            className={cn(
              "font-medium cursor-pointer text-sm select-none",
              day.isOpen ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {day.label}
          </label>
        </div>

        {/* Time Slots Area */}
        <div className="flex-1 flex flex-col gap-2 w-full">
          {day.isOpen ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {day.timeSlots.map((slot, index) => (
                  <TimeRangeInput
                    key={index}
                    startTime={slot.start}
                    endTime={slot.end}
                    onStartTimeChange={(val) => updateSlot(index, "start", val)}
                    onEndTimeChange={(val) => updateSlot(index, "end", val)}
                    onRemove={() => removeSlot(index)}
                    showRemoveButton={day.timeSlots.length > 1}
                    hasOverlap={isSlotOverlapping(index)}
                  />
                ))}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={addSlot}
                      className="size-8 rounded-full text-primary hover:bg-primary/10 hover:text-primary"
                    >
                      <Plus className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Thêm khung giờ (ca gãy)</TooltipContent>
                </Tooltip>
              </div>

               {/* Errors */}
               {!validation.isValid && (
                <div className="flex items-start gap-1.5 text-destructive text-xs mt-1">
                  <AlertTriangle className="size-3.5 mt-0.5 shrink-0" />
                  <span>{validation.errors.join(", ")}</span>
                </div>
              )}
            </div>
          ) : (
             <span className="text-sm text-muted-foreground italic px-2">Đóng cửa</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0 ml-auto sm:ml-0">
          {isCopySource ? (
            <Button
              variant="secondary"
              size="sm"
              onClick={onCancelCopy}
              className="h-8 text-xs hover:bg-muted/80 text-foreground"
            >
              <X className="size-3.5 mr-1.5" />
              Hủy
            </Button>
          ) : isPasteTarget ? (
             <Button
              variant="default"
              size="sm"
              onClick={onPaste}
              className="h-8 text-xs animate-in fade-in zoom-in-95 duration-200"
            >
              <Clipboard className="size-3.5 mr-1.5" />
              Dán
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={onCopy} className="size-8 text-muted-foreground">
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

