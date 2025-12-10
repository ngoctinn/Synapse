'use client';

import * as React from "react";
import { ArrowRight, Trash2 } from "lucide-react";
import { TimePicker } from "@/shared/ui/custom/time-picker";
import { Button } from "@/shared/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { cn } from "@/shared/lib/utils";

interface TimeRangeInputProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onRemove?: () => void;
  className?: string;
  showRemoveButton?: boolean;
}

export function TimeRangeInput({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  onRemove,
  className,
  showRemoveButton = true
}: TimeRangeInputProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 bg-background/80 backdrop-blur-sm p-1.5 rounded-xl border border-transparent hover:border-border/80 hover:shadow-sm transition-all duration-200 group/slot",
      className
    )}>
      <TimePicker 
        value={startTime}
        onChange={onStartTimeChange}
        className="w-24 xs:w-28 border-none shadow-none bg-transparent focus:ring-0 text-sm font-medium"
      />
      <ArrowRight className="w-3 h-3 text-muted-foreground/50" />
      <TimePicker 
         value={endTime}
         onChange={onEndTimeChange}
         className="w-24 xs:w-28 border-none shadow-none bg-transparent focus:ring-0 text-right text-sm font-medium"
      />
      
      {showRemoveButton && onRemove && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onRemove}
                className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-100 sm:opacity-0 sm:group-hover/slot:opacity-100 transition-all duration-200 rounded-full ml-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Xóa khung giờ</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}
