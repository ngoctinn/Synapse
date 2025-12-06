"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { CalendarClock, Check, ChevronLeft, ChevronRight, Settings2, Wrench, PartyPopper } from "lucide-react";
import { DateRangePicker } from "@/shared/ui/custom/date-range-picker";
import { DateRange } from "react-day-picker";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { YearPicker } from "@/shared/ui/custom/year-picker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
  addDays,
  addWeeks,
  addMonths,
  addYears,
  differenceInDays,
  startOfYear,
  endOfYear,
  subYears,
  isSameDay,
  isSameMonth,
  isSameYear,
  getYear,
  setYear,
  isValid
} from "date-fns";
import { FilterButton } from "@/shared/ui/custom/filter-button";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Separator } from "@/shared/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/shared/ui/toggle-group";
import { FilterUnit } from "../hooks/use-exception-filters";
import { useState, useEffect } from "react";

interface ExceptionsFilterBarProps {
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  
  typeFilter: string[];
  setTypeFilter: (types: string[] | null) => void;
  
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  
  filterUnit: FilterUnit; // Kept for navigation logic
  setFilterUnit: (unit: FilterUnit) => void;

  onClearFilters: () => void;
  activeCount: number;
  viewMode: 'calendar' | 'list';
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

const FILTER_TYPES = [
  {
    id: 'holiday',
    label: 'Ngày lễ',
    icon: PartyPopper,
  },
  {
    id: 'custom',
    label: 'Tùy chỉnh',
    icon: Settings2,
  },
  {
    id: 'maintenance',
    label: 'Bảo trì',
    icon: Wrench,
  }
];

export function ExceptionsFilterBar({
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter,
  dateRange,
  setDateRange,
  filterUnit,
  setFilterUnit,
  onClearFilters,
  activeCount,
  viewMode,
  startContent,
  endContent
}: ExceptionsFilterBarProps) {

  // Year Selection Handler - Moved to YearViewGrid


  const handlePresetSelect = (preset: string) => {
    const now = new Date();
    let start: Date | undefined;
    let end: Date | undefined;
    let unit: FilterUnit = 'custom';

    switch (preset) {
      case 'all':
        setDateRange(undefined);
        setFilterUnit('all');
        return;
      case 'today':
        start = startOfDay(now);
        end = endOfDay(now);
        unit = 'day';
        break;
      case 'yesterday':
        const yesterday = subDays(now, 1);
        start = startOfDay(yesterday);
        end = endOfDay(yesterday);
        unit = 'day';
        break;
      case 'thisWeek':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        unit = 'week';
        break;
      case 'last7days':
        start = subDays(now, 7);
        end = now;
        unit = 'custom';
        break;
      case 'thisMonth':
        start = startOfMonth(now);
        end = endOfMonth(now);
        unit = 'month';
        break;
      case 'lastMonth':
        const lastMonth = subMonths(now, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        unit = 'month';
        break;
      case 'thisYear':
        start = startOfYear(now);
        end = endOfYear(now);
        unit = 'year';
        break;
      case 'lastYear':
        const lastYear = subYears(now, 1);
        start = startOfYear(lastYear);
        end = endOfYear(lastYear);
        unit = 'year';
        break;
    }

    if (start && end) {
      setDateRange({ from: start, to: end });
      setFilterUnit(unit);
    }
  };

  // Logic for List Mode date navigation
  const handleDateNavigation = (direction: 'prev' | 'next') => {
    if (!dateRange?.from || !dateRange?.to) return;
    const isNext = direction === 'next';

    let newStart = dateRange.from;
    let newEnd = dateRange.to;

    // Use explicit filterUnit first
    switch (filterUnit) {
      case 'day':
        const dayShift = isNext ? 1 : -1;
        newStart = addDays(dateRange.from, dayShift);
        newEnd = addDays(dateRange.to, dayShift);
        break;
      case 'week':
         const weekShift = isNext ? 1 : -1;
         newStart = addWeeks(dateRange.from, weekShift);
         newEnd = addWeeks(dateRange.to, weekShift);
         break;
      case 'month':
         const monthShift = isNext ? 1 : -1;
         // Intelligent month shifting: snap to full month if currently full month
         if (isSameDay(dateRange.from, startOfMonth(dateRange.from)) && 
             isSameDay(dateRange.to, endOfMonth(dateRange.to))) {
               const nextMonth = addMonths(dateRange.from, monthShift);
               newStart = startOfMonth(nextMonth);
               newEnd = endOfMonth(nextMonth);
         } else {
            newStart = addMonths(dateRange.from, monthShift);
            newEnd = addMonths(dateRange.to, monthShift);
         }
         break;
      case 'year':
         const yearShift = isNext ? 1 : -1;
         if (isSameDay(dateRange.from, startOfYear(dateRange.from)) &&
             isSameDay(dateRange.to, endOfYear(dateRange.to))) {
               const nextYear = addYears(dateRange.from, yearShift);
               newStart = startOfYear(nextYear);
               newEnd = endOfYear(nextYear);
         } else {
             newStart = addYears(dateRange.from, yearShift);
             newEnd = addYears(dateRange.to, yearShift);
         }
         break;
      case 'custom':
      default:
         // Fallback to diff based sliding window
         const diffDays = Math.abs(differenceInDays(dateRange.to, dateRange.from));
         const shiftDays = diffDays + 1; // +1 to include both ends
         const shift = isNext ? shiftDays : -shiftDays;
         newStart = addDays(dateRange.from, shift);
         newEnd = addDays(dateRange.to, shift);
         break;
    }
    
    setDateRange({ from: newStart, to: newEnd });
  };

  const handleManualDateChange = (range: DateRange | undefined) => {
      setDateRange(range);
      if (range) {
          setFilterUnit('custom');
      }
  };

  const isActivePreset = (preset: string) => {
    if (!dateRange?.from) return preset === 'all';
    const now = new Date();

    switch (preset) {
      case 'all':
        return false;
      case 'today':
        return filterUnit === 'day' && isSameDay(dateRange.from, now);
      case 'yesterday':
        return filterUnit === 'day' && isSameDay(dateRange.from, subDays(now, 1));
      case 'thisWeek':
        return filterUnit === 'week' && isSameDay(dateRange.from, startOfWeek(now, { weekStartsOn: 1 }));
      case 'thisMonth':
        return filterUnit === 'month' && isSameMonth(dateRange.from, now);
      case 'lastMonth':
        return filterUnit === 'month' && isSameMonth(dateRange.from, subMonths(now, 1));
      case 'thisYear':
        return filterUnit === 'year' && isSameYear(dateRange.from, now);
      case 'lastYear':
        return filterUnit === 'year' && isSameYear(dateRange.from, subYears(now, 1));
      default:
        return false;
    }
  };

  return (
    <motion.div 
      layout
      className="flex flex-col xl:flex-row items-center justify-between gap-3 w-full"
    >
      {/* LEFT: StartContent + Date Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
        {startContent && (
           <>
             <div className="w-full sm:w-auto flex justify-center">{startContent}</div>
             <Separator orientation="vertical" className="h-6 hidden sm:block" />
             <Separator orientation="horizontal" className="w-full sm:hidden" />
           </>
        )}

        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide justify-center sm:justify-start">
        
        {viewMode === 'list' && (
            <div className="flex items-center rounded-lg border bg-background/50 p-1 gap-1 shrink-0 shadow-sm">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2.5 gap-2 text-muted-foreground hover:text-foreground font-normal hover:bg-accent hover:text-accent-foreground data-[state=open]:bg-accent"
                        >
                        <CalendarClock className="w-4 h-4" />
                        <span className="hidden lg:inline">Chọn nhanh</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[200px]">
                        <DropdownMenuItem onClick={() => handlePresetSelect('all')}>
                            Tất cả thời gian
                            {isActivePreset('all') && <Check className="ml-auto w-4 h-4" />}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handlePresetSelect('today')}>
                            Hôm nay
                            {isActivePreset('today') && <Check className="ml-auto w-4 h-4" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePresetSelect('yesterday')}>
                            Hôm qua
                            {isActivePreset('yesterday') && <Check className="ml-auto w-4 h-4" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePresetSelect('thisWeek')}>
                            Tuần này
                            {isActivePreset('thisWeek') && <Check className="ml-auto w-4 h-4" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePresetSelect('thisMonth')}>
                            Tháng này
                            {isActivePreset('thisMonth') && <Check className="ml-auto w-4 h-4" />}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePresetSelect('thisYear')}>
                             Năm nay
                            {isActivePreset('thisYear') && <Check className="ml-auto w-4 h-4" />}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Separator orientation="vertical" className="h-5 mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleDateNavigation('prev')}
                    disabled={!dateRange || filterUnit === 'all'}
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="min-w-[200px] text-center relative overflow-hidden">
                    <AnimatePresence mode="wait">
                         <motion.div
                            key={dateRange ? `${dateRange.from?.toISOString()}-${dateRange.to?.toISOString()}` : 'all'}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                         >
                            <DateRangePicker 
                                date={dateRange}
                                setDate={handleManualDateChange}
                                className="w-full border-none shadow-none hover:bg-accent/50 transition-colors h-8 px-2 font-medium justify-center bg-transparent"
                                placeholder="Tất cả thời gian"
                            />
                         </motion.div>
                    </AnimatePresence>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => handleDateNavigation('next')}
                    disabled={!dateRange || filterUnit === 'all'}
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        )}
        </div>
      </div>

      {/* RIGHT: EndContent + Filters */}
      <div className="flex items-center gap-2 w-full xl:w-auto justify-end">
        {endContent}
        <FilterButton
          isActive={activeCount > 0}
          count={activeCount}
          onClear={onClearFilters}
          className=""
        >
        <div className="grid gap-6 p-1">
          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Trạng thái</Label>
            <Select 
                value={statusFilter || 'all'} 
                onValueChange={(val) => setStatusFilter(val === 'all' ? null : val)}
            >
              <SelectTrigger className="h-10 w-full bg-background">
                <SelectValue placeholder="Tất cả trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="open">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span>Mở cửa</span>
                    </div>
                </SelectItem>
                <SelectItem value="closed">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-destructive" />
                        <span>Đóng cửa</span>
                    </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="h-[1px] bg-border/50" />

          {/* Type Filter */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Loại thay đổi</Label>
            <ToggleGroup 
                type="multiple" 
                variant="outline"
                value={typeFilter} 
                onValueChange={(val) => setTypeFilter(val.length ? val : null)}
                className="justify-start flex-wrap gap-2"
            >
                {FILTER_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                        <ToggleGroupItem 
                            key={type.id} 
                            value={type.id} 
                            aria-label={type.label}
                            className="h-8 px-3 gap-2 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
                        >
                            <Icon className="w-4 h-4" />
                            {type.label}
                        </ToggleGroupItem>
                    );
                })}
            </ToggleGroup>
          </div>
        </div>
      </FilterButton>
      </div>
    </motion.div>
  );
}
