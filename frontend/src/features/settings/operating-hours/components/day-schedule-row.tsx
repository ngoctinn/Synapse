import { Switch } from "@/shared/ui/switch";
import { Label } from "@/shared/ui/label";
import { TimeRangeInput } from "@/shared/ui/custom/time-range-input";
import { DaySchedule } from "../model/types";
import { DAY_LABELS } from "../model/mocks";
import { cn } from "@/shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { useTimeSlots } from "../hooks/use-time-slots";

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

  return (
    <div className={cn(
      "flex flex-col sm:flex-row items-start sm:items-baseline justify-between p-5 rounded-2xl border transition-all duration-300 group relative gap-4 sm:gap-0",
      schedule.isOpen 
        ? "bg-card border-border/60 shadow-sm hover:shadow-md hover:border-primary/30" 
        : "bg-muted/20 border-transparent opacity-70 hover:opacity-90",
      isCopying && "ring-2 ring-primary border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--primary),0.1)]",
      isPasteTarget && "ring-2 ring-dashed ring-green-500/50 border-green-500/50 bg-green-50/50 cursor-pointer scale-[1.01]"
    )}>
      <div className="flex items-center gap-5 w-full sm:w-56">
        <Switch 
          checked={schedule.isOpen} 
          onCheckedChange={handleToggleOpen}
          id={`switch-${schedule.day}`}
          className="data-[state=checked]:bg-primary scale-110"
        />
        <Label 
          htmlFor={`switch-${schedule.day}`}
          className={cn(
            "font-semibold cursor-pointer text-base capitalize transition-colors select-none",
            schedule.isOpen ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {DAY_LABELS[schedule.day]}
        </Label>
      </div>

      <div className="flex-1 flex flex-col items-end gap-3 overflow-hidden min-h-[44px] w-full">
        <AnimatePresence mode="wait">
          {schedule.isOpen ? (
            <motion.div 
              key="open"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex flex-col gap-3 w-full items-end"
            >
              <div className="flex flex-wrap gap-3 w-full justify-end items-center">
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
              </div>
              
              <div className="flex items-center gap-3 mt-1 mr-1">
                 <TooltipProvider>
                   <Tooltip>
                     <TooltipTrigger asChild>
                       <Button
                        variant="ghost"
                        size="sm"
                        onClick={addSlot}
                        className="text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/10 h-8 px-3 rounded-full transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1.5" />
                        Thêm khung giờ
                      </Button>
                     </TooltipTrigger>
                     <TooltipContent>Thêm khung giờ hoạt động mới</TooltipContent>
                   </Tooltip>
                 </TooltipProvider>
                
                {/* Copy/Paste Buttons */}
                {isCopying ? (
                   <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancelCopy}
                    className="text-xs font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-8 px-3 rounded-full"
                  >
                    ✖ Hủy
                  </Button>
                ) : isPasteTarget ? (
                   <TooltipProvider>
                     <Tooltip>
                       <TooltipTrigger asChild>
                         <Button
                          variant="outline"
                          size="sm"
                          onClick={onPaste}
                          className="text-xs font-medium text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 h-8 px-3 rounded-full animate-pulse"
                        >
                          📋 Dán cấu hình
                        </Button>
                       </TooltipTrigger>
                       <TooltipContent>Dán cấu hình từ ngày đã chọn</TooltipContent>
                     </Tooltip>
                   </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onCopy}
                          className="text-xs font-medium text-muted-foreground hover:text-foreground h-8 px-3 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-200"
                        >
                          ❐ Sao chép
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Sao chép cấu hình ngày này</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-between w-full h-full">
               <motion.div 
                key="closed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 text-muted-foreground/60 bg-muted/20 border border-dashed border-muted-foreground/10 px-5 py-2.5 rounded-xl w-full max-w-sm ml-auto"
              >
                <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                  <Clock className="w-4 h-4 opacity-50" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Đóng cửa</span>
                  <span className="text-xs opacity-70">Không nhận lịch hẹn vào ngày này</span>
                </div>
              </motion.div>
               
               {/* Copy/Paste Buttons for Closed State */}
               <div className="ml-4 flex items-center">
                {isCopying ? (
                   <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancelCopy}
                    className="text-xs font-medium text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-8 px-3 rounded-full"
                  >
                    ✖ Hủy
                  </Button>
                ) : isPasteTarget ? (
                   <TooltipProvider>
                     <Tooltip>
                       <TooltipTrigger asChild>
                         <Button
                          variant="outline"
                          size="sm"
                          onClick={onPaste}
                          className="text-xs font-medium text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 h-8 px-3 rounded-full animate-pulse"
                        >
                          📋 Dán
                        </Button>
                       </TooltipTrigger>
                       <TooltipContent>Dán cấu hình từ ngày đã chọn</TooltipContent>
                     </Tooltip>
                   </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onCopy}
                          className="text-xs font-medium text-muted-foreground hover:text-foreground h-8 px-3 rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-200"
                        >
                          ❐ Sao chép
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Sao chép cấu hình ngày này</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
               </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
