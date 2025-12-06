import { Button } from '@/shared/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarView } from '../types';

interface CalendarHeaderProps {
  date: Date;
  onDateChange: (date: Date) => void;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

export function CalendarHeader({ date, onDateChange, view, onViewChange }: CalendarHeaderProps) {
  const handlePrev = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="-mx-4 w-[calc(100%+2rem)] px-4 py-2 bg-background border-b flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm transition-all duration-200 sticky top-[var(--header-height)] z-30">
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border bg-background p-0.5 shadow-sm">
          <Button variant="ghost" size="icon" className="rounded-md" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="font-medium" onClick={handleToday}>
            Hôm nay
          </Button>
          <Button variant="ghost" size="icon" className="rounded-md" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="ml-2 flex flex-col">
          <span className="text-lg font-bold text-foreground capitalize">
            {format(date, 'EEEE, d MMMM, yyyy', { locale: vi })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select value={view} onValueChange={(v) => onViewChange(v as CalendarView)}>
          <SelectTrigger className="w-[140px] h-9 bg-background">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
            <SelectValue placeholder="Chế độ xem" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="timeline">Timeline (KTV)</SelectItem>
            <SelectItem value="day">Ngày</SelectItem>
            <SelectItem value="week">Tuần</SelectItem>
            <SelectItem value="month">Tháng</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
