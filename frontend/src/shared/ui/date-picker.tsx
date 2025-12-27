"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  /**
   * Minimum date allowed
   */
  minDate?: Date;
  /**
   * Maximum date allowed
   */
  maxDate?: Date;
  hasError?: boolean;
  modal?: boolean;
  size?: "default" | "sm";
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Chọn ngày",
  className,
  disabled,
  minDate,
  maxDate,
  hasError,
  modal = false,
  size = "default",
}: DatePickerProps) {
  return (
    <Popover modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "group w-full justify-start text-left font-normal border-input hover:bg-accent/50 transition-all focus-premium",
            "bg-background shadow-xs text-sm px-3 text-foreground",
            size === "default" && "h-10",
            size === "sm" && "h-8",
            "data-[state=open]:border-primary/80 data-[state=open]:ring-[1.5px] data-[state=open]:ring-primary/20",
            !value && "text-muted-foreground",
            hasError && "border-destructive text-destructive focus-visible:ring-destructive/20",
            className
          )}
        >
          <CalendarIcon className={cn("mr-2 h-4 w-4 opacity-50 transition-colors group-data-[state=open]:text-primary group-hover:text-foreground", hasError && "text-destructive")} />
          {value ? format(value, "dd/MM/yyyy", { locale: vi }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-none shadow-premium-lg bg-card/95 backdrop-blur-md" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
          initialFocus
          locale={vi}
        />
      </PopoverContent>
    </Popover>
  );
}
