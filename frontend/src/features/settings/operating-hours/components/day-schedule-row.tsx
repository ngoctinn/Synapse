import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { TimeRangeInput } from "@/shared/ui/custom/time-range-input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { ClipboardPaste, Clock, Copy, Plus, X } from "lucide-react";
import { useTimeSlots } from "../hooks/use-time-slots";
import { DAY_LABELS } from "../model/mocks";
import { DaySchedule } from "../model/types";

interface DayScheduleRowProps {
  schedule: DaySchedule;
  onChange: (newSchedule: DaySchedule) => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onCancelCopy?: () => void;
  isCopying?: boolean;
  isPasteTarget?: boolean;
}

export function DayScheduleRow({
  schedule,
  onChange,
  onCopy,
  onPaste,
  onCancelCopy,
  isCopying,
  isPasteTarget
}: DayScheduleRowProps) {
  const { updateSlot, addSlot, removeSlot } = useTimeSlots(
    schedule.timeSlots,
    (newSlots) => onChange({ ...schedule, timeSlots: newSlots })
  );

  const handleToggleOpen = (checked: boolean) => {
    onChange({ ...schedule, isOpen: checked });
  };

  // Render copy/paste button dựa trên trạng thái
  const renderCopyPasteButton = () => {
    if (isCopying) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancelCopy}
          className="text-xs font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-8 px-2.5"
        >
          <X className="w-3.5 h-3.5 mr-1" />
          Hủy
        </Button>
      );
    }

    if (isPasteTarget) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={onPaste}
              className="text-xs font-medium text-success border-success/30 hover:bg-success/10 hover:text-success h-8 px-2.5 animate-pulse"
            >
              <ClipboardPaste className="w-3.5 h-3.5 mr-1" />
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
            className="text-xs font-medium text-muted-foreground hover:text-foreground h-8 px-2.5"
          >
            <Copy className="w-3.5 h-3.5 mr-1" />
            Sao chép
          </Button>
        </TooltipTrigger>
        <TooltipContent>Sao chép cấu hình ngày này</TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border transition-all duration-200 gap-4",
        schedule.isOpen
          ? "bg-card border-border/60 shadow-sm hover:shadow-md hover:border-primary/20"
          : "bg-muted/30 border-transparent",
        isCopying && "ring-2 ring-primary border-primary bg-primary/5",
        isPasteTarget && "ring-2 ring-dashed ring-success/50 border-success/50 bg-success/5"
      )}>
        {/* Left: Switch + Label */}
        <div className="flex items-center gap-4 shrink-0">
          <Switch
            checked={schedule.isOpen}
            onCheckedChange={handleToggleOpen}
            id={`switch-${schedule.day}`}
          />
          <Label
            htmlFor={`switch-${schedule.day}`}
            className={cn(
              "font-medium cursor-pointer text-sm capitalize transition-colors select-none min-w-[70px]",
              schedule.isOpen ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {DAY_LABELS[schedule.day]}
          </Label>
        </div>

        {/* Right: Content based on isOpen state */}
        <div className="flex-1 flex items-center justify-end gap-3 w-full sm:w-auto">
          {schedule.isOpen ? (
            <>
              {/* Time slots */}
              <div className="flex flex-wrap gap-2 items-center justify-end flex-1">
                {schedule.timeSlots.map((slot, index) => (
                  <TimeRangeInput
                    key={index}
                    startTime={slot.start}
                    endTime={slot.end}
                    onStartTimeChange={(val) => updateSlot(index, 'start', val)}
                    onEndTimeChange={(val) => updateSlot(index, 'end', val)}
                    onRemove={() => removeSlot(index)}
                    showRemoveButton={schedule.timeSlots.length > 1}
                  />
                ))}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={addSlot}
                      className="text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/10 h-8 px-2.5"
                    >
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Thêm
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Thêm khung giờ</TooltipContent>
                </Tooltip>
              </div>

              {/* Copy/Paste button */}
              {renderCopyPasteButton()}
            </>
          ) : (
            <>
              {/* Closed state indicator */}
              <div className="flex items-center gap-2 text-muted-foreground/70 bg-muted/30 px-3 py-1.5 rounded-lg flex-1 max-w-[200px]">
                <Clock className="w-4 h-4 opacity-50 shrink-0" />
                <span className="text-sm">Đóng cửa</span>
              </div>

              {/* Copy/Paste button */}
              {renderCopyPasteButton()}
            </>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
