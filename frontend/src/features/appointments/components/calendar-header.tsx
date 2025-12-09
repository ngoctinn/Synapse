import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/shared/ui/tabs";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isSameWeek,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks
} from 'date-fns';
import { vi } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarView } from '../types';

interface CalendarHeaderProps {
  date: Date;
  onDateChange: (date: Date) => void;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function CalendarHeader({ date, onDateChange, view, onViewChange }: CalendarHeaderProps) {

  // Logic điều hướng dựa trên View
  const handlePrev = () => {
    switch (view) {
      case 'week':
        onDateChange(subWeeks(date, 1));
        break;
      case 'month':
        onDateChange(subMonths(date, 1));
        break;
      case 'day':
      case 'timeline':
      default:
        onDateChange(subDays(date, 1));
    }
  };

  const handleNext = () => {
    switch (view) {
      case 'week':
        onDateChange(addWeeks(date, 1));
        break;
      case 'month':
        onDateChange(addMonths(date, 1));
        break;
      case 'day':
      case 'timeline':
      default:
        onDateChange(addDays(date, 1));
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  // Label cho nút "Hôm nay/Tuần này/Tháng này"
  const getNavigateLabel = () => {
    switch (view) {
      case 'week':
        return 'Tuần này';
      case 'month':
        return 'Tháng này';
      case 'day':
      case 'timeline':
      default:
        return 'Hôm nay';
    }
  };

  // Label hiển thị ngày tháng ở giữa
  const getDateLabel = () => {
    switch (view) {
      case 'month':
        return format(date, 'MMMM yyyy', { locale: vi });
      case 'week': {
        const start = startOfWeek(date, { weekStartsOn: 1 });
        const end = endOfWeek(date, { weekStartsOn: 1 });
        // Nếu cùng tháng: 09 - 15 Tháng 12, 2025
        if (isSameMonth(start, end)) {
           return `${format(start, 'd')} - ${format(end, 'd MMMM, yyyy', { locale: vi })}`;
        }
        // Khác tháng: 29 Tháng 11 - 05 Tháng 12, 2025
        return `${format(start, 'd MMM', { locale: vi })} - ${format(end, 'd MMM, yyyy', { locale: vi })}`;
      }
      case 'day':
      case 'timeline':
      default:
        return format(date, 'EEEE, d MMMM, yyyy', { locale: vi });
    }
  };

  // Kiểm tra xem có đang ở "Hôm nay/Tuần này/Tháng này" hay không để disable hoặc highlight (optional styling)
  const isCurrent = () => {
    const now = new Date();
    switch (view) {
      case 'month': return isSameMonth(date, now);
      case 'week': return isSameWeek(date, now, { weekStartsOn: 1 });
      case 'day':
      case 'timeline': return isSameDay(date, now);
      default: return false;
    }
  };

  return (
    <div className="px-4 py-2 bg-background border-b flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-200 sticky top-[var(--appointment-header-height-mobile)] md:top-[var(--appointment-header-height)] z-40">
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border bg-background p-0.5 shadow-sm">
          <Button variant="ghost" size="icon" className="rounded-md" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className={cn("font-medium min-w-[80px]", isCurrent() && "text-primary font-bold")}
            onClick={handleToday}
          >
            {getNavigateLabel()}
          </Button>
          <Button variant="ghost" size="icon" className="rounded-md" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="ml-2 flex flex-col">
          <span className="text-lg font-bold text-foreground capitalize min-w-[200px]">
            {getDateLabel()}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Tabs value={view} onValueChange={(v) => onViewChange(v as CalendarView)}>
          <TabsList className="h-9 bg-muted/50 p-1">
            <TabsTrigger
              value="timeline"
              className="px-4"
            >
              Timeline (KTV)
            </TabsTrigger>
            <TabsTrigger
              value="day"
              className="px-4"
            >
              Ngày
            </TabsTrigger>
            <TabsTrigger
              value="week"
              className="px-4"
            >
              Tuần
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="px-4"
            >
              Tháng
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
