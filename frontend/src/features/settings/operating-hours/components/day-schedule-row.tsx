import { Switch } from "@/shared/ui/switch";
import { Label } from "@/shared/ui/label";
import { TimeInput } from "./time-input";
import { DaySchedule } from "../model/types";
import { DAY_LABELS } from "../model/mocks";
import { cn } from "@/shared/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface DayScheduleRowProps {
  schedule: DaySchedule;
  onChange: (newSchedule: DaySchedule) => void;
}

export function DayScheduleRow({ schedule, onChange }: DayScheduleRowProps) {
  const handleToggleOpen = (checked: boolean) => {
    onChange({ ...schedule, isOpen: checked });
  };

  const handleTimeChange = (index: number, field: 'start' | 'end', value: string) => {
    const newTimeSlots = [...schedule.timeSlots];
    newTimeSlots[index] = { ...newTimeSlots[index], [field]: value };
    onChange({ ...schedule, timeSlots: newTimeSlots });
  };

  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-lg border transition-all duration-200",
      schedule.isOpen ? "bg-card border-border shadow-sm" : "bg-muted/30 border-transparent opacity-70"
    )}>
      <div className="flex items-center gap-4 w-40">
        <Switch 
          checked={schedule.isOpen} 
          onCheckedChange={handleToggleOpen}
          id={`switch-${schedule.day}`}
        />
        <Label 
          htmlFor={`switch-${schedule.day}`}
          className="font-medium cursor-pointer text-base capitalize"
        >
          {DAY_LABELS[schedule.day]}
        </Label>
      </div>

      <div className="flex-1 flex items-center gap-6 overflow-hidden min-h-[40px]">
        <AnimatePresence mode="wait">
          {schedule.isOpen ? (
            <motion.div 
              key="open"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2"
            >
              {schedule.timeSlots.map((slot, index) => (
                <div key={index} className="flex items-center gap-3">
                  <TimeInput 
                    value={slot.start}
                    onChange={(e) => handleTimeChange(index, 'start', e.target.value)}
                    className="w-27"
                  />
                  <span className="text-muted-foreground font-medium">-</span>
                  <TimeInput 
                     value={slot.end}
                     onChange={(e) => handleTimeChange(index, 'end', e.target.value)}
                     className="w-27"
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.span 
              key="closed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-muted-foreground italic pl-2"
            >
              Đóng cửa
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
