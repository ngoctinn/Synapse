"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
  hasError?: boolean;
  placeholder?: string;
  /** Giờ tối thiểu (VD: "09:00") */
  min?: string;
  /** Giờ tối đa (VD: "17:00") */
  max?: string;
  /** Khoảng cách phút (Mặc định 15p theo chuẩn UX/UI, hoặc 5p nếu cần) */
  step?: number;
  /** Kích thước của input */
  size?: "default" | "sm" | "lg" | "icon";
}

export function TimePicker({
  value,
  onChange,
  className,
  disabled,
  hasError,
  placeholder = "Chọn giờ",
  min,
  max,
  step = 5,
  size = "default",
}: TimePickerProps) {
  // Generate time slots based on step/min/max
  const timeSlots = React.useMemo(() => {
    const slots = [];
    const totalMinutes = 24 * 60;

    for (let i = 0; i < totalMinutes; i += step) {
      const hours = Math.floor(i / 60);
      const minutes = i % 60;
      const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

      // Filter logic
      if (min && time < min) continue;
      if (max && time > max) continue;

      slots.push(time);
    }
    return slots;
  }, [step, min, max]);

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger
        size={size}
        className={cn(
          "font-normal",
          hasError && "border-destructive text-destructive focus-visible:ring-destructive/20",
          className
        )}
        aria-invalid={hasError}
      >
        <div className="flex items-center gap-2">
          <Clock className={cn("size-4 shrink-0", hasError ? "text-destructive" : "text-muted-foreground/50")} />
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-[200px]">
        {timeSlots.map((time) => (
          <SelectItem key={time} value={time}>
            {time}
          </SelectItem>
        ))}
        {timeSlots.length === 0 && (
          <div className="p-2 text-sm text-muted-foreground text-center">
            Không có giờ phù hợp
          </div>
        )}
      </SelectContent>
    </Select>
  );
}
