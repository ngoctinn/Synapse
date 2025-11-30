"use client"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Calendar } from "@/shared/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover"
import { format, isToday } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar as CalendarIcon, LucideIcon, LucideProps, X } from "lucide-react"
import { useState } from "react"

interface BirthdayPickerProps {
  date?: Date
  setDate: (date?: Date) => void
  placeholder?: string
  className?: string
  icon?: LucideIcon
  iconProps?: LucideProps
}

export function BirthdayPicker({
  date,
  setDate,
  placeholder = "Chọn ngày sinh",
  className,
  icon: Icon = CalendarIcon, // Default icon
  iconProps,
}: BirthdayPickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  // Xử lý khi chọn ngày
  const handleSelect = (newDate?: Date) => {
    setDate(newDate)
    setIsPopoverOpen(false)
  }

  // Xử lý xóa ngày
  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDate(undefined)
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div className="relative group w-full">
          {/* Icon bên trái (giống InputWithIcon) */}
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground group-data-[state=open]:text-primary">
            <Icon size={18} {...iconProps} />
          </div>

          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-between text-left font-normal transition-all duration-200 pl-10", // pl-10 để tránh đè icon
              !date && "text-muted-foreground",
              isPopoverOpen && "border-primary ring-2 ring-primary/20",
              className
            )}
          >
            {date ? (
              format(date, "dd/MM/yyyy")
            ) : (
              <span>{placeholder}</span>
            )}

            {/* Nút xóa (bên phải) */}
            {date && (
              <div
                role="button"
                tabIndex={0}
                onClick={handleClear}
                className="ml-2 rounded-full p-1 opacity-50 hover:bg-primary/10 hover:text-destructive hover:opacity-100 focus:bg-primary/10 focus:opacity-100 focus:outline-none"
              >
                <X className="h-3 w-3" />
              </div>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 backdrop-blur-xl bg-background/95" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          required={false}
          captionLayout="dropdown"
          fromYear={1900}
          toYear={new Date().getFullYear()} // Không cho chọn tương lai
          defaultMonth={date || new Date(new Date().getFullYear() - 20, 0)} // Mặc định nhảy về 20 năm trước nếu chưa chọn
          formatters={{
            formatCaption: (date) =>
              format(date, "'Tháng' MM 'Năm' yyyy", { locale: vi }),
            formatMonthDropdown: (date) =>
              format(date, "'Tháng' MM", { locale: vi }),
          }}
          locale={vi}
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  )
}
