"use client";

/**
 * DateNavigator - Component điều hướng ngày/tuần/tháng
 *
 * Hiển thị: [< Trước] [Hôm nay] [Sau >] + Label thời gian hiện tại
 * Có thể mở DatePicker để nhảy đến ngày cụ thể.
 */

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { cn } from "@/shared/lib/utils";
import {
    Button,
    Calendar as CalendarPicker,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/shared/ui";

interface DateNavigatorProps {
  /** Ngày hiện tại đang hiển thị */
  date: Date;
  /** Chuỗi mô tả khoảng thời gian (ví dụ: "11 - 17 tháng 12, 2024") */
  formattedDateRange: string;
  /** Đang xem ngày hôm nay? */
  isToday?: boolean;
  /** Di chuyển về trước */
  onPrev: () => void;
  /** Di chuyển về sau */
  onNext: () => void;
  /** Về hôm nay */
  onToday: () => void;
  /** Nhảy đến ngày cụ thể */
  onDateSelect?: (date: Date) => void;
  className?: string;
}

export function DateNavigator({
  date,
  formattedDateRange,
  isToday = false,
  onPrev,
  onNext,
  onToday,
  onDateSelect,
  className,
}: DateNavigatorProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate && onDateSelect) {
      onDateSelect(selectedDate);
      setIsCalendarOpen(false);
    }
  };

  return (
    <div className={cn("flex items-center gap-1 sm:gap-2", className)}>
      {/* Previous Button */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={onPrev}
        title="Trước đó"
      >
        <ChevronLeft className="size-4" />
        <span className="sr-only">Trước đó</span>
      </Button>

      {/* Today Button */}
      <Button
        variant={isToday ? "secondary" : "outline"}
        size="sm"
        className={cn(
          "h-8 px-2 sm:px-3 text-xs sm:text-sm",
          isToday && "bg-primary/10 text-primary hover:bg-primary/20"
        )}
        onClick={onToday}
        disabled={isToday}
      >
        Hôm nay
      </Button>

      {/* Next Button */}
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={onNext}
        title="Tiếp theo"
      >
        <ChevronRight className="size-4" />
        <span className="sr-only">Tiếp theo</span>
      </Button>

      {/* Date Range Display + DatePicker */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={cn(
              "h-8 gap-2 px-2 sm:px-3 text-sm font-medium",
              "hover:bg-accent hover:text-accent-foreground",
              "hidden xs:flex" // Ẩn trên màn hình quá nhỏ
            )}
          >
            <CalendarIcon className="size-4 text-muted-foreground" />
            <span className="hidden sm:inline">{formattedDateRange}</span>
            <span className="sm:hidden">
              {format(date, "dd/MM", { locale: vi })}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarPicker
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            locale={vi}
            weekStartsOn={1}
            className="rounded-md border"
          />
        </PopoverContent>
      </Popover>

      {/* Mobile: Show date range separately */}
      <span className="xs:hidden text-sm font-medium text-muted-foreground ml-2 truncate max-w-[120px]">
        {format(date, "dd/MM/yyyy", { locale: vi })}
      </span>
    </div>
  );
}
