"use client";

import { format, isValid } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  LucideIcon,
  LucideProps,
} from "lucide-react";
import * as React from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import { MaskedDateInput } from "./masked-date-input";

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  /**
   * Mode hiển thị:
   * - `calendar`: Trigger Button + Popover Calendar (Mặc định)
   * - `input`: Masked Input cho phép nhập tay (DD/MM/YYYY)
   */
  mode?: "calendar" | "input";
  /** Icon tùy chỉnh */
  icon?: LucideIcon;
  iconProps?: LucideProps;
  /** Trạng thái lỗi (chỉ dùng cho mode input) */
  error?: boolean | string;
  /** Callback khi input không hợp lệ (chỉ dùng cho mode input) */
  onInvalidInput?: (isInvalid: boolean) => void;
  minDate?: Date;
  maxDate?: Date;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Chọn ngày",
  className,
  disabled,
  mode = "calendar",
  icon: Icon = CalendarIcon,
  iconProps,
  error,
  onInvalidInput,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // --- MODE: INPUT (Masked) ---
  if (mode === "input") {
    return (
      <div className={cn("w-full", className)}>
        <MaskedDateInput
          value={value}
          onChange={onChange}
          icon={Icon}
          iconProps={iconProps}
          placeholder={placeholder}
          error={error}
          onInvalidInput={onInvalidInput}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
        />
      </div>
    );
  }

  // --- MODE: CALENDAR (Popover) ---
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-between px-3 text-left font-normal border-input",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Icon className="text-muted-foreground size-4 shrink-0" {...iconProps} />
            <span className="truncate">
              {value && isValid(value)
                ? format(value, "dd/MM/yyyy", { locale: vi })
                : placeholder}
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange?.(date);
            setOpen(false);
          }}
          locale={vi}
          initialFocus
          captionLayout="dropdown"
          fromYear={1900}
          toYear={new Date().getFullYear() + 10}
          classNames={{
            caption_dropdowns: "flex gap-2",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
