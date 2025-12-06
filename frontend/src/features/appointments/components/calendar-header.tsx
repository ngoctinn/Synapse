import { Button } from '@/shared/ui/button';
import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/shared/ui/tabs";
import { format } from 'date-fns';
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
    <div className="px-4 py-2 bg-background border-b flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm transition-all duration-200 sticky top-[var(--appointment-header-height-mobile)] md:top-[var(--appointment-header-height)] z-40">
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
        <Tabs value={view} onValueChange={(v) => onViewChange(v as CalendarView)}>
          <TabsList className="h-9 bg-muted/50 p-1">
            <TabsTrigger
              value="timeline"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 transition-all duration-200"
            >
              Timeline (KTV)
            </TabsTrigger>
            <TabsTrigger
              value="day"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 transition-all duration-200"
            >
              Ngày
            </TabsTrigger>
            <TabsTrigger
              value="week"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 transition-all duration-200"
            >
              Tuần
            </TabsTrigger>
            <TabsTrigger
              value="month"
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 transition-all duration-200"
            >
              Tháng
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
