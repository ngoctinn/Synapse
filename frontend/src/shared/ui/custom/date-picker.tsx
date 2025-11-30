"use client"

import { format, isToday } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Calendar } from "@/shared/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui/popover"
import { useState } from "react"

/**
 * Props cho component DatePicker
 */
interface DatePickerProps {
  /** Ngày được chọn hiện tại */
  date?: Date
  /** Hàm callback khi chọn ngày */
  setDate: (date?: Date) => void
  /** Placeholder hiển thị khi chưa chọn ngày */
  placeholder?: string
  /** Class tùy chỉnh cho button trigger */
  className?: string
  /** Năm bắt đầu cho dropdown chọn năm (Mặc định: 1900) */
  fromYear?: number
  /** Năm kết thúc cho dropdown chọn năm (Mặc định: Năm hiện tại + 10) */
  toYear?: number
}

/**
 * Component chọn ngày tháng (DatePicker)
 * Hỗ trợ chọn nhanh Năm/Tháng và nút quay về Hôm nay.
 */
export function DatePicker({
  date,
  setDate,
  placeholder = "Chọn ngày",
  className,
  fromYear = 1900,
  toYear = new Date().getFullYear() + 10,
}: DatePickerProps) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  // Xử lý khi chọn ngày
  const handleSelect = (newDate?: Date) => {
    setDate(newDate)
    setIsPopoverOpen(false) // Đóng popover sau khi chọn
  }

  // Xử lý chọn ngày hôm nay
  const handleSelectToday = () => {
    const today = new Date()
    setDate(today)
    setIsPopoverOpen(false)
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 animate-in zoom-in duration-300" />
          {date ? (
            isToday(date) ? (
              <span className="font-medium text-primary">Hôm nay ({format(date, "dd/MM/yyyy")})</span>
            ) : (
              format(date, "dd/MM/yyyy")
            )
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          captionLayout="dropdown" // Cho phép chọn Năm/Tháng qua dropdown
          fromYear={fromYear}
          toYear={toYear}
          formatters={{
            formatCaption: (date) => format(date, "'Tháng' MM 'Năm' yyyy", { locale: vi }),
          }}
          locale={vi}
          className="rounded-md border"
        />
        {/* Footer: Nút chọn nhanh Hôm nay */}
        <div className="border-t p-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center text-primary hover:bg-primary/10 hover:text-primary"
            onClick={handleSelectToday}
          >
            Hôm nay
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
