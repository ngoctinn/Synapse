"use client"

import { cn } from "@/shared/lib/utils"
import { Calendar as CalendarIcon, LucideIcon, LucideProps } from "lucide-react"
import { MaskedDateInput } from "./masked-date-input"

interface BirthdayPickerProps {
  date?: Date
  setDate: (date?: Date) => void
  placeholder?: string
  className?: string
  icon?: LucideIcon
  iconProps?: LucideProps
  error?: boolean | string
  onInvalidInput?: (isInvalid: boolean) => void
  minDate?: Date
  maxDate?: Date
}

export function BirthdayPicker({
  date,
  setDate,
  className,
  icon = CalendarIcon,
  iconProps,
  placeholder = "DD/MM/YYYY",
  error,
  onInvalidInput,
  minDate,
  maxDate,
}: BirthdayPickerProps) {
  return (
    <div className={cn("w-full", className)}>
      <MaskedDateInput
        value={date}
        onChange={setDate}
        icon={icon}
        iconProps={iconProps}
        placeholder={placeholder}
        error={error}
        onInvalidInput={onInvalidInput}
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  )
}
