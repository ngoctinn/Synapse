"use client"

import { addDays, nextMonday } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Calendar } from "@/shared/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui/popover"
import { MaskedDateInput } from "./masked-date-input"

interface DatePickerProps {
  date?: Date
  setDate: (date?: Date) => void
  placeholder?: string
  className?: string
  fromYear?: number
  toYear?: number
}

export function DatePicker({
  date,
  setDate,
  className,
  fromYear,
  toYear,
  placeholder = "DD/MM/YYYY",
}: DatePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)

  const handleSelect = (newDate?: Date) => {
    setDate(newDate)
    setIsPopoverOpen(false)
  }

  const handleSelectToday = () => handleSelect(new Date())
  const handleSelectTomorrow = () => handleSelect(addDays(new Date(), 1))
  const handleSelectNextMonday = () => handleSelect(nextMonday(new Date()))

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex-1">
        <MaskedDateInput
          value={date}
          onChange={setDate}
          placeholder={placeholder}
          className="pr-10" // Space for the calendar button inside if we wanted, but here it's outside
        />
      </div>

      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-9 w-9 shrink-0 transition-all duration-200",
              isPopoverOpen && "border-primary ring-2 ring-primary/20"
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 backdrop-blur-xl bg-background/95" align="end">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            locale={vi}
            fromYear={fromYear}
            toYear={toYear}
            className="rounded-md border-b"
          />
          <div className="p-3 grid grid-cols-2 gap-2 bg-muted/30">
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-8 hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleSelectToday}
            >
              Hôm nay
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs h-8 hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleSelectTomorrow}
            >
              Ngày mai
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="col-span-2 w-full text-xs h-8 hover:bg-primary/10 hover:text-primary transition-colors"
              onClick={handleSelectNextMonday}
            >
              Thứ Hai tới
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
