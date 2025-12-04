"use client";

import { cn } from "@/shared/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { Clock } from "lucide-react";
import * as React from "react";

interface TimePickerProps {
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number; // Optional max limit in minutes
  step?: number; // Default 15
  placeholder?: string;
  className?: string;
}

export function TimePicker({
  value,
  onChange,
  min = 0,
  max = 480, // Default 8 hours
  step = 15,
  placeholder = "Chọn thời gian",
  className,
}: TimePickerProps) {
  // Generate time options
  const options = React.useMemo(() => {
    const opts = [];
    for (let i = min; i <= max; i += step) {
      if (i === 0 && min > 0) continue; // Skip 0 if min > 0
      opts.push(i);
    }
    return opts;
  }, [min, max, step]);

  const formatTime = (minutes: number) => {
    return `${minutes} phút`;
  };

  return (
    <Select
      value={value?.toString()}
      onValueChange={(val) => onChange(Number(val))}
    >
      <SelectTrigger className={cn(
          "w-full transition-all duration-200 focus:ring-2 focus:ring-primary/20 focus:border-primary",
          className
        )}>
        <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[200px] rounded-xl shadow-lg border-slate-100 dark:border-slate-800">
        {options.map((option) => (
          <SelectItem
            key={option}
            value={option.toString()}
            className="cursor-pointer focus:bg-blue-50 focus:text-blue-700 dark:focus:bg-blue-900/30 dark:focus:text-blue-300 rounded-lg my-0.5 mx-1"
          >
            {formatTime(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
