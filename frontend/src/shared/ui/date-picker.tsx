"use client";

import { cn } from "@/shared/lib/utils";
import { Button, type ButtonProps } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

interface DatePickerProps extends Omit<ButtonProps, "onChange" | "value"> {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minDate?: Date;
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
  ...props
}: DatePickerProps) {
  const isInvalid = !!(hasError || props["aria-invalid"] === true || props["aria-invalid"] === "true");

  return (
    <Popover modal={modal}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          disabled={disabled}
          className={cn(
            "group w-full justify-start text-left font-normal border-input hover:bg-accent/50 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            "bg-background shadow-xs text-base md:text-sm px-3 text-foreground",
            size === "default" && "h-10",
            size === "sm" && "h-8",
            !value && "text-muted-foreground",
            isInvalid && "border-destructive/80 text-destructive focus-visible:ring-destructive/20 hover:border-destructive",
            className
          )}
          {...props}
        >
          <CalendarIcon className={cn("mr-2 h-4 w-4 opacity-50 transition-colors group-data-[state=open]:text-primary group-hover:text-foreground", isInvalid && "text-destructive")} />
          {value ? format(value, "dd/MM/yyyy", { locale: vi }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-border bg-popover shadow-md" align="start">
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
