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

interface DurationPickerProps {
  value?: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number; // Optional max limit in minutes
  step?: number; // Default 15
  placeholder?: string;
  className?: string;
  iconClassName?: string;
}

export function DurationPicker({
  value,
  onChange,
  min = 0,
  max = 480, // Default 8 hours
  step = 15,
  placeholder = "Chọn thời gian",
  className,
  iconClassName,
}: DurationPickerProps) {
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
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${minutes} phút (${hours} giờ)`;
    return `${minutes} phút (${hours} giờ ${mins} phút)`;
  };

  return (
    <Select
      value={value?.toString()}
      onValueChange={(val) => onChange(Number(val))}
    >
      <SelectTrigger className={cn("w-full", className)}>
        <div className="flex items-center gap-2">
            <Clock className={cn("h-[18px] w-[18px] text-muted-foreground", iconClassName)} />
            <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        {options.map((option) => (
          <SelectItem key={option} value={option.toString()}>
            {formatTime(option)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
