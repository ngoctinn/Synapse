import { Switch } from "@/shared/ui/switch";
import { Label } from "@/shared/ui/label";
import { TimePicker } from "@/shared/ui/custom/time-picker";
import { DaySchedule } from "../model/types";
import { DAY_LABELS } from "../model/mocks";
import { cn } from "@/shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";

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
  const handleToggleOpen = (checked: boolean) => {
    onChange({ ...schedule, isOpen: checked });
  };

  const handleTimeChange = (index: number, field: 'start' | 'end', value: string) => {
    const newTimeSlots = [...schedule.timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    onChange({ ...schedule, timeSlots: newTimeSlots });
  };

  const handleAddSlot = () => {
    const newTimeSlots = [...schedule.timeSlots, { start: "08:00", end: "17:00" }];
    onChange({ ...schedule, timeSlots: newTimeSlots });
  };

  const handleRemoveSlot = (index: number) => {
    const newTimeSlots = schedule.timeSlots.filter((_, i) => i !== index);
    onChange({ ...schedule, timeSlots: newTimeSlots });
  };

  return (
    <div className={cn(
      "flex items-start justify-between p-5 rounded-2xl border transition-all duration-300 group relative",
      schedule.isOpen 
        ? "bg-card border-border/60 shadow-sm hover:shadow-md hover:border-primary/30" 
        : "bg-muted/20 border-transparent opacity-70 hover:opacity-90",
      isCopying && "ring-2 ring-primary border-primary bg-primary/5 shadow-[0_0_15px_rgba(var(--primary),0.1)]",
      isPasteTarget && "ring-2 ring-dashed ring-green-500/50 border-green-500/50 bg-green-50/50 cursor-pointer scale-[1.01]"
    )}>
      <div className="flex items-center gap-5 w-56 pt-2">
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

      <div className="flex-1 flex flex-col items-end gap-3 overflow-hidden min-h-[44px]">
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
              {schedule.timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-3 bg-background/80 backdrop-blur-sm p-1.5 rounded-xl border border-transparent hover:border-border/80 hover:shadow-sm transition-all duration-200 group/slot w-full max-w-xl justify-end">
                  <TimePicker 
                    value={slot.start}
                    onChange={(val) => handleTimeChange(index, 'start', val)}
                    className="w-36 border-none shadow-none bg-transparent focus:ring-0 text-sm font-medium"
                  />
                  <ArrowRight className="w-4 h-4 text-muted-foreground/50" />
                  <TimePicker 
                     value={slot.end}
                     onChange={(val) => handleTimeChange(index, 'end', val)}
                     className="w-36 border-none shadow-none bg-transparent focus:ring-0 text-right text-sm font-medium"
                  />
                  <div className="w-8 flex justify-center">
                    {schedule.timeSlots.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveSlot(index)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover/slot:opacity-100 transition-all duration-200 rounded-full"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              <div className="flex items-center gap-3 mt-1 mr-1">
                 <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddSlot}
                  className="text-xs font-medium text-primary hover:text-primary/80 hover:bg-primary/10 h-8 px-3 rounded-full transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 mr-1.5" />
                  Thêm khung giờ
                </Button>
                
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
                   <Button
                    variant="outline"
                    size="sm"
                    onClick={onPaste}
                    className="text-xs font-medium text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 h-8 px-3 rounded-full animate-pulse"
                  >
                    📋 Dán cấu hình
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCopy}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground h-8 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    ❐ Sao chép
                  </Button>
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
                   <Button
                    variant="outline"
                    size="sm"
                    onClick={onPaste}
                    className="text-xs font-medium text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 h-8 px-3 rounded-full animate-pulse"
                  >
                    📋 Dán
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCopy}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground h-8 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    ❐ Sao chép
                  </Button>
                )}
               </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
