  "use client";

/**
 * DayRow - Component hiển thị và chỉnh sửa lịch 1 ngày
 * Tham chiếu: docs/research/operating-hours-uxui.md - Section 4.1
 *
 * [REFACTORED] Fix E1: Thêm validation overlap time slots
 */

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { TimeRangeInput } from "@/shared/ui/custom/time-range-input";
import { Switch } from "@/shared/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { AlertTriangle, ClipboardPaste, Clock, Copy, Plus, X } from "lucide-react";
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
  // Validate time slots for overlap (Fix E1)
  const validation = useMemo(() => {
    if (!day.isOpen || day.timeSlots.length === 0) {
      return { isValid: true, errors: [], invalidSlotIndexes: [], overlappingPairs: [] };
    }
    return validateTimeSlots(day.timeSlots);
  }, [day.isOpen, day.timeSlots]);

  // Check if a specific slot index is involved in any overlap
  const isSlotOverlapping = (index: number) => {
    return validation.overlappingPairs.some(([i, j]: [number, number]) => i === index || j === index);
  };

  // Toggle open/closed
  const handleToggle = (checked: boolean) => {
    onChange({
      ...day,
      isOpen: checked,
      // Reset to default slot when turning ON
      timeSlots: checked && day.timeSlots.length === 0
        ? [{ start: DEFAULT_OPEN_TIME, end: DEFAULT_CLOSE_TIME }]
        : day.timeSlots,
    });
  };

  // Update specific time slot
  const updateSlot = (index: number, field: "start" | "end", value: string) => {
    const newSlots = [...day.timeSlots];
    newSlots[index] = { ...newSlots[index], [field]: value };
    onChange({ ...day, timeSlots: newSlots });
  };

  // Add new time slot (split-shift support)
  const addSlot = () => {
    const lastSlot = day.timeSlots[day.timeSlots.length - 1];
    const newSlot: TimeSlot = lastSlot
      ? { start: lastSlot.end, end: DEFAULT_CLOSE_TIME }
      : { start: DEFAULT_OPEN_TIME, end: DEFAULT_CLOSE_TIME };
    onChange({ ...day, timeSlots: [...day.timeSlots, newSlot] });
  };

  // Remove time slot
  const removeSlot = (index: number) => {
    if (day.timeSlots.length <= 1) return;
    const newSlots = day.timeSlots.filter((_, i) => i !== index);
    onChange({ ...day, timeSlots: newSlots });
  };

  // Render copy/paste button
  const renderCopyPasteButton = () => {
    if (isCopySource && onCancelCopy) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancelCopy}
          className="text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10"
        >
          <X className="size-3.5 mr-1" />
          Hủy
        </Button>
      );
    }

    if (isPasteTarget && onPaste) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onPaste}
              className="text-xs text-primary border-primary/30 hover:bg-primary/10 animate-pulse"
            >
              <ClipboardPaste className="size-3.5 mr-1" />
              Dán
            </Button>
          </TooltipTrigger>
          <TooltipContent>Dán cấu hình từ ngày đã chọn</TooltipContent>
        </Tooltip>
      );
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopy}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <Copy className="size-3.5 mr-1" />
            Sao chép
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sao chép cấu hình ngày này</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-[200px_1fr_auto] gap-4 items-center p-4 rounded-xl border transition-all duration-200",
          // State Based Styling
          // 1. Copy Source: Focused, Highlighted
          isCopySource && "ring-2 ring-primary border-primary bg-primary/5 shadow-md z-10 relative",

          // 2. Paste Target: Dimmed initially, Active on Hover
          isPasteTarget && [
            "opacity-40 grayscale-[0.8] scale-[0.99] border-dashed border-primary/30",
            "hover:opacity-100 hover:grayscale-0 hover:scale-100 hover:bg-primary/5 hover:border-primary/50 hover:ring-2 hover:ring-primary/20 hover:z-10 hover:shadow-sm cursor-pointer"
          ],

          // 3. Normal State
          !isCopySource && !isPasteTarget && (day.isOpen
            ? "bg-card border-border/60 shadow-sm hover:shadow-md hover:border-primary/20"
            : "bg-muted/30 border-transparent"
          )
        )}
      >
        {/* Col 1: Switch + Label */}
        <div className="flex items-center gap-4 shrink-0">
          <Switch
            checked={day.isOpen}
            onCheckedChange={handleToggle}
            id={`switch-${day.dayOfWeek}`}
          />
          <label
            htmlFor={`switch-${day.dayOfWeek}`}
            className={cn(
              "font-medium cursor-pointer text-sm transition-colors select-none min-w-[70px]",
              day.isOpen ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {day.label}
          </label>
        </div>

        {/* Col 2: Time slots or Closed indicator */}
        <div className="flex-1 w-full flex flex-col gap-2 min-w-0">
          {day.isOpen ? (
            <>
              <div className="flex flex-wrap gap-2 items-center">
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
                      size="sm"
                      onClick={addSlot}
                      className="text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/10"
                    >
                      <Plus className="size-3.5 mr-1" />
                      Thêm ca
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Thêm khung giờ làm việc (ca gãy)</TooltipContent>
                </Tooltip>
              </div>
              {/* Validation Error Messages (Fix E1) */}
              {!validation.isValid && (
                <div className="flex items-start gap-2 text-warning text-xs bg-warning/10 px-3 py-2 rounded-lg border border-warning/20">
                  <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-0.5">
                    {validation.errors.map((error: string, i: number) => (
                      <span key={i}>{error}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground/70 bg-muted/30 px-3 py-1.5 rounded-lg max-w-[200px]">
              <Clock className="size-4 opacity-50 shrink-0" />
              <span className="text-sm">Đóng cửa</span>
            </div>
          )}
        </div>

        {/* Col 3: Actions */}
        <div className="flex items-center justify-end gap-2 w-full md:w-auto">
          {renderCopyPasteButton()}
        </div>
      </div>
    </TooltipProvider>
  );
}
