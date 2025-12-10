"use client"

import { format, isValid, parse } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar as CalendarIcon, LucideIcon, LucideProps } from "lucide-react"
import * as React from "react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Calendar } from "@/shared/ui/calendar"
import { Input } from "@/shared/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover"
import { MaskedDateInput } from "./masked-date-input"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  /**
   * Mode hiển thị:
   * - `calendar`: Input readonly + Popover Calendar (Mặc định)
   * - `input`: Masked Input cho phép nhập tay (DD/MM/YYYY)
   */
  mode?: "calendar" | "input"
  /** Icon tùy chỉnh (chỉ dùng cho mode input hoặc trigger button) */
  icon?: LucideIcon
  iconProps?: LucideProps
  /** Trạng thái lỗi (chỉ dùng cho mode input) */
  error?: boolean | string
  /** Callback khi input không hợp lệ (chỉ dùng cho mode input) */
  onInvalidInput?: (isInvalid: boolean) => void
  minDate?: Date
  maxDate?: Date
}

export function DatePicker({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  className,
  disabled,
  mode = "calendar",
  icon: Icon = CalendarIcon,
  iconProps,
  error,
  onInvalidInput,
  minDate,
  maxDate
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

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
    )
  }

  // --- MODE: CALENDAR (Popover) ---
  // Sync input value when date prop changes
  React.useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, "dd/MM/yyyy", { locale: vi }))
    } else {
        setInputValue("")
    }
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    // Allow clearing
    if (newValue === "") {
        onChange?.(undefined)
        return
    }

    // Attempt partial validation/masking could be done here,
    // but strict parsing is safer for logic
    const parsedDate = parse(newValue, "dd/MM/yyyy", new Date(), { locale: vi })

    if (isValid(parsedDate) && newValue.length === 10) {
        onChange?.(parsedDate)
    }
  }

  const handleSelect = (selectedDate: Date | undefined) => {
      if (onChange) {
          onChange(selectedDate)
      }
      setOpen(false) // Close popover after selection
  }

  return (
    <div className={cn("relative w-full", className)}>
        <Input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn("pr-10 cursor-pointer", className)} // Add padding for icon
            onClick={() => !disabled && setOpen(true)} // Open on click inputs
            readOnly // Make it readonly to force picker usage preference in 'calendar' mode, or allow typing if desired (but handleInputChange handles it)
                     // Based on request, 'calendar' usually implies popup preference. Keeping it editable for now but triggering popup.
                     // Actually, user compliant might prefer strict one or the other.
                     // Current implementation allows typing.
        />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground hover:text-foreground"
            disabled={disabled}
          >
            <Icon className="h-4 w-4" {...iconProps} />
            <span className="sr-only">Open calendar</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            locale={vi}
            initialFocus
            captionLayout="dropdown"
            fromYear={1900}
            toYear={new Date().getFullYear() + 5}
            classNames={{
                caption_dropdowns: "flex gap-2",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
