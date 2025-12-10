"use client"

import { format, isValid, parse } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
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

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = "DD/MM/YYYY",
  className,
  disabled
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

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
            className={cn("pr-10", className)} // Add padding for icon
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
            <CalendarIcon className="h-4 w-4" />
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
            toYear={new Date().getFullYear()}
            classNames={{
                caption_dropdowns: "flex gap-2",
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
