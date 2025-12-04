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
      "flex items-start justify-between p-4 rounded-xl border transition-all duration-300 group relative",
      schedule.isOpen 
        ? "bg-card border-border shadow-sm hover:shadow-md hover:border-primary/20" 
        : "bg-muted/30 border-transparent opacity-60 hover:opacity-80",
      isCopying && "ring-2 ring-primary border-primary bg-primary/5",
      isPasteTarget && "ring-2 ring-dashed ring-green-500/50 border-green-500/50 bg-green-50/50 cursor-pointer"
    )}>
      <div className="flex items-center gap-4 w-48 pt-2">
        <Switch 
          checked={schedule.isOpen} 
          onCheckedChange={handleToggleOpen}
          id={`switch-${schedule.day}`}
          className="data-[state=checked]:bg-primary"
        />
        <Label 
          htmlFor={`switch-${schedule.day}`}
          className={cn(
            "font-medium cursor-pointer text-base capitalize transition-colors",
            schedule.isOpen ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {DAY_LABELS[schedule.day]}
        </Label>
      </div>

      <div className="flex-1 flex flex-col items-end gap-2 overflow-hidden min-h-[40px]">
        <AnimatePresence mode="wait">
          {schedule.isOpen ? (
            <motion.div 
              key="open"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2 w-full items-end"
            >
              {schedule.timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-3 bg-background/50 p-1 rounded-lg border border-transparent hover:border-border transition-colors group/slot">
                  <TimePicker 
                    value={slot.start}
                    onChange={(val) => handleTimeChange(index, 'start', val)}
                    className="w-32 border-none shadow-none bg-transparent focus:ring-0"
                  />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <TimePicker 
                     value={slot.end}
                     onChange={(val) => handleTimeChange(index, 'end', val)}
                     className="w-32 border-none shadow-none bg-transparent focus:ring-0 text-right"
                  />
                  {schedule.timeSlots.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveSlot(index)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover/slot:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-1">
                 <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAddSlot}
                  className="text-xs text-primary hover:text-primary/80 hover:bg-primary/10 h-7"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Thêm khung giờ
                </Button>
                
                {/* Copy/Paste Buttons */}
                {isCopying ? (
                   <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancelCopy}
                    className="text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-7"
                  >
                    ✖ Hủy
                  </Button>
                ) : isPasteTarget ? (
                   <Button
                    variant="outline"
                    size="sm"
                    onClick={onPaste}
                    className="text-xs text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 h-7 animate-pulse"
                  >
                    📋 Dán
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCopy}
                    className="text-xs text-muted-foreground hover:text-foreground h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ❐ Copy
                  </Button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex items-center justify-between w-full">
               <motion.div 
                key="closed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-4 py-2 rounded-full mt-1"
              >
                <Clock className="w-4 h-4" />
                <span className="italic text-sm">Đóng cửa</span>
              </motion.div>
               {/* Copy/Paste Buttons for Closed State */}
               <div className="mt-1">
                {isCopying ? (
                   <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancelCopy}
                    className="text-xs text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-7"
                  >
                    ✖ Hủy
                  </Button>
                ) : isPasteTarget ? (
                   <Button
                    variant="outline"
                    size="sm"
                    onClick={onPaste}
                    className="text-xs text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 h-7 animate-pulse"
                  >
                    📋 Dán
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCopy}
                    className="text-xs text-muted-foreground hover:text-foreground h-7 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ❐ Copy
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
