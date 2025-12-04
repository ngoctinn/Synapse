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
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
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
    <div className="flex flex-col gap-4 border-b bg-white/80 backdrop-blur-md p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sticky top-0 z-30 transition-all duration-200">
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border bg-white p-0.5 shadow-sm">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={handlePrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-3 font-medium" onClick={handleToday}>
            Hôm nay
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="ml-2 flex flex-col">
          <span className="text-lg font-bold text-gray-900 capitalize font-serif">
            {format(date, 'EEEE, d MMMM, yyyy', { locale: vi })}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select value={view} onValueChange={(v) => onViewChange(v as CalendarView)}>
          <SelectTrigger className="w-[140px] h-9 bg-white">
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

        <Button variant="outline" size="sm" className="h-9 gap-2 hidden md:flex">
          <Filter className="h-4 w-4" />
          Bộ lọc
        </Button>

        <Button variant="default" size="sm" className="h-9 shadow-md bg-primary hover:bg-primary/90">
          + Tạo lịch hẹn
        </Button>
      </div>
    </div>
  );
}
