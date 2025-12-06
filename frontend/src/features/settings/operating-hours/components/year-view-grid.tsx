
"use client";

import { useMemo, useRef } from "react";
import { format, eachMonthOfInterval, startOfYear, endOfYear, startOfMonth, endOfMonth, eachDayOfInterval, getDay, startOfDay, endOfDay, isWithinInterval } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/shared/lib/utils";
import { ExceptionDate } from "../model/types";
import { SmartTooltip } from "./smart-tooltip";
import { getStatusStyles } from "../utils/style-helpers";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { YearPicker } from "@/shared/ui/custom/year-picker";

import { DateRange } from "react-day-picker";

interface YearViewGridProps {
    year: number;
    exceptions: ExceptionDate[];
    matchedDateKeys: Set<string>; // New prop
    selectedDates: Date[];
    activeDateRange?: DateRange; // Props for dimming outside range
    onSelectDates: (dates: Date[]) => void;
    onYearChange: (year: number) => void;
}

export function YearViewGrid({ year, exceptions, matchedDateKeys, selectedDates, activeDateRange, onSelectDates, onYearChange }: YearViewGridProps) {
    const months = useMemo(() => {
        const start = startOfYear(new Date(year, 0));
        return eachMonthOfInterval({ start, end: endOfYear(start) });
    }, [year]);

    // Drag State
    const isDragging = useRef(false);
    const dragStartDate = useRef<Date | null>(null);
    const dragAction = useRef<'select' | 'deselect'>('select');
    
    // Performance: Map for fast lookup
    const exceptionMap = useMemo(() => {
        const map = new Map<string, ExceptionDate>();
        exceptions.forEach(e => map.set(format(e.date, 'yyyy-MM-dd'), e));
        return map;
    }, [exceptions]);

    const selectedSet = useMemo(() => {
        const set = new Set<string>();
        selectedDates.forEach(d => set.add(format(d, 'yyyy-MM-dd')));
        return set;
    }, [selectedDates]);

    // Handlers
    const handleMouseDown = (date: Date) => {
        isDragging.current = true;
        dragStartDate.current = date;

        const id = format(date, 'yyyy-MM-dd');
        const isSelected = selectedSet.has(id);
        dragAction.current = isSelected ? 'deselect' : 'select';

        const newDates = isSelected 
            ? selectedDates.filter(d => format(d, 'yyyy-MM-dd') !== id)
            : [...selectedDates, date];

        onSelectDates(newDates);
    };

    const handleMouseEnter = (date: Date) => {
        if (!isDragging.current || !dragStartDate.current) return;
        
        const start = dragStartDate.current;
        const end = date;
        
        // Calculate range
        const range = eachDayOfInterval({
            start: start < end ? start : end,
            end: end > start ? end : start
        });
        
        const rangeIds = new Set(range.map(d => format(d, 'yyyy-MM-dd')));

        let newDates: Date[];

        if (dragAction.current === 'select') {
             const toAdd = range.filter(d => !selectedSet.has(format(d, 'yyyy-MM-dd')));
             if (toAdd.length === 0) return;
             newDates = [...selectedDates, ...toAdd];
        } else {
             newDates = selectedDates.filter(d => !rangeIds.has(format(d, 'yyyy-MM-dd')));
             if (newDates.length === selectedDates.length) return;
        }
        
        onSelectDates(newDates);
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        dragStartDate.current = null;
    };

    // Global Mouse Up to catch release outside grid
    useMemo(() => {
        if (typeof window !== 'undefined') {
            window.addEventListener('mouseup', handleMouseUp);
            return () => window.removeEventListener('mouseup', handleMouseUp);
        }
    }, []);

    const handleNextYear = () => onYearChange(year + 1);
    const handlePrevYear = () => onYearChange(year - 1);
    const handleYearSelect = (date: Date) => onYearChange(date.getFullYear());
    const currentDateForPicker = useMemo(() => new Date(year, 0, 1), [year]);

    return (
        <div className="space-y-4">
            <div className="px-4 pt-2 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center rounded-lg border bg-background/50 p-1 gap-1 shrink-0 shadow-sm w-fit">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={handlePrevYear}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-2 px-2">
                        <YearPicker 
                            date={currentDateForPicker}
                            onSelect={handleYearSelect}
                            className="w-[100px] h-8 border-none bg-transparent hover:bg-accent/50 text-center justify-center font-bold"
                        />
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={handleNextYear}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm p-3 rounded-lg border border-dashed bg-muted/20 md:ml-auto">
                    {/* Status Group */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase text-muted-foreground/60 font-bold tracking-wider mr-1">Trạng thái</span>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-sm border border-emerald-500/50 bg-background flex items-center justify-center shadow-sm">
                                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 leading-none pt-[1px]">12</span>
                                </div>
                                <span className="text-muted-foreground text-xs">Mở cửa</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-sm border border-rose-500/50 bg-background flex items-center justify-center shadow-sm">
                                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 leading-none pt-[1px]">12</span>
                                </div>
                                <span className="text-muted-foreground text-xs">Đóng cửa</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-px h-4 bg-border/50 hidden sm:block mx-1" />

                    {/* Type Group */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase text-muted-foreground/60 font-bold tracking-wider mr-1">Loại</span>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-sm bg-red-100 dark:bg-red-900/30 border border-transparent flex items-center justify-center shadow-sm">
                                    <span className="text-[10px] text-muted-foreground/60 font-bold leading-none pt-[1px]">12</span>
                                </div>
                                <span className="text-muted-foreground text-xs">Ngày lễ</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-sm bg-amber-100 dark:bg-amber-900/30 border border-transparent flex items-center justify-center shadow-sm">
                                    <span className="text-[10px] text-muted-foreground/60 font-bold leading-none pt-[1px]">12</span>
                                </div>
                                <span className="text-muted-foreground text-xs">Bảo trì</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-sm bg-blue-100 dark:bg-blue-900/30 border border-transparent flex items-center justify-center shadow-sm">
                                    <span className="text-[10px] text-muted-foreground/60 font-bold leading-none pt-[1px]">12</span>
                                </div>
                                <span className="text-muted-foreground text-xs">Tùy chỉnh</span>
                            </div>
                        </div>
                    </div>

                     <div className="w-px h-4 bg-border/50 hidden sm:block mx-1" />

                     {/* Date Group */}
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase text-muted-foreground/60 font-bold tracking-wider mr-1">Hiển thị</span>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-sm bg-muted border border-transparent flex items-center justify-center shadow-sm">
                                    <span className="text-[10px] font-bold text-foreground leading-none pt-[1px]">24</span>
                                </div>
                                <span className="text-muted-foreground text-xs">Đã lọc</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-sm bg-muted/30 border border-transparent flex items-center justify-center grayscale opacity-50">
                                    <span className="text-[10px] font-medium text-muted-foreground leading-none pt-[1px]">24</span>
                                </div>
                                <span className="text-muted-foreground text-xs opacity-70">Ẩn</span>
                            </div>
                        </div>
                     </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 select-none">
                {months.map(month => (
                    <MonthCard 
                        key={month.toISOString()} 
                        month={month}
                        exceptionMap={exceptionMap}
                        matchedDateKeys={matchedDateKeys}
                        selectedSet={selectedSet}
                        activeDateRange={activeDateRange}
                        onMouseDown={handleMouseDown}
                        onMouseEnter={handleMouseEnter}
                    />
                ))}
            </div>
        </div>
    );
}




interface MonthCardProps {
    month: Date;
    exceptionMap: Map<string, ExceptionDate>;
    matchedDateKeys: Set<string>;
    selectedSet: Set<string>;
    activeDateRange?: DateRange;
    onMouseDown: (date: Date) => void;
    onMouseEnter: (date: Date) => void;
}

// Sub-component for individual Month (Lightweight)
function MonthCard({ month, exceptionMap, matchedDateKeys, selectedSet, activeDateRange, onMouseDown, onMouseEnter }: MonthCardProps) {
    const days = useMemo(() => {
        const start = startOfMonth(month);
        const end = endOfMonth(month);
        return eachDayOfInterval({ start, end });
    }, [month]);

    const startDayOfWeek = getDay(startOfMonth(month)); // 0 = Sunday
    // Adjust for Monday start: (startDayOfWeek + 6) % 7
    const offset = (startDayOfWeek + 6) % 7;
    
    // Creating blanks
    const blanks = Array(offset).fill(null); 
    
    return (
         <div className="space-y-2">
             <div className="text-sm font-bold text-muted-foreground capitalize">
                 {format(month, 'MMMM', { locale: vi })}
             </div>
             <div className="grid grid-cols-7 gap-1 text-xs">
                 {['T2','T3','T4','T5','T6','T7','CN'].map(d => (
                     <div key={d} className="text-center text-muted-foreground/50 text-[10px]">{d}</div>
                 ))}
                 
                 {blanks.map((_, i) => <div key={`blank-${i}`} />)}
                 
                 {days.map(date => {
                     const id = format(date, 'yyyy-MM-dd');
                     const exception = exceptionMap.get(id);
                     const isSelected = selectedSet.has(id);
                     const isMatched = matchedDateKeys?.has(id) ?? true; 
                     
                     // Check if date is within active view/filter range
                     // If activeDateRange is undefined, we assume full year/all valid
                     let isInRange = true;
                     if (activeDateRange?.from && activeDateRange?.to) {
                         // We compare visually -> start/end of day inclusive
                         // Simple string comparison might be faster but date-fns is safer
                         if (date < startOfDay(activeDateRange.from) || date > endOfDay(activeDateRange.to)) {
                             isInRange = false;
                         }
                     }

                     let bgClass = "bg-muted/30 hover:bg-muted";
                     
                     // Dimming Styles (Unified)
                     const dimClasses = "opacity-30 grayscale saturate-0 scale-75 hover:opacity-100 hover:grayscale-0 hover:saturate-100 hover:scale-100 hover:shadow-sm hover:z-10 hover:ring-1 hover:ring-ring/50 transition-all duration-200 ease-out";

                     if (isSelected) {
                         bgClass = "bg-primary text-primary-foreground";
                     } else if (exception) {
                         const styles = getStatusStyles(exception.type, exception.isClosed);
                         if (isMatched) {
                             // Normal (Highlighted)
                             bgClass = styles.calendarItem; 
                         } else {
                             // Unmatched Exception -> Dimmed
                             bgClass = cn(styles.calendarItem, dimClasses);
                         }
                     } else {
                         // Normal Empty Day
                         if (!isInRange) {
                             // Out of range Empty Day -> Dimmed
                             bgClass = cn("bg-muted/30", dimClasses);
                         }
                     }

                     return (
                         <SmartTooltip key={id} date={date} exception={exception}>
                             <div 
                                 className={cn(
                                     "aspect-square flex items-center justify-center rounded-sm cursor-pointer text-[10px] transition-colors relative",
                                     bgClass
                                 )}
                                 onMouseDown={() => onMouseDown(date)}
                                 onMouseEnter={() => onMouseEnter(date)}
                             >
                                 {format(date, 'd')}
                             </div>
                         </SmartTooltip>
                     )
                 })}
             </div>
         </div>
    )
}
