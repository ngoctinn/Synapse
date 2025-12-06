
"use client";

import { useMemo, useRef } from "react";
import { format, eachMonthOfInterval, startOfYear, endOfYear, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/shared/lib/utils";
import { ExceptionDate } from "../model/types";
import { SmartTooltip } from "./smart-tooltip";
import { getStatusStyles } from "../utils/style-helpers";
import { Button } from "@/shared/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { YearPicker } from "@/shared/ui/custom/year-picker";

interface YearViewGridProps {
    year: number;
    exceptions: ExceptionDate[];
    selectedDates: Date[];
    onSelectDates: (dates: Date[]) => void;
    onYearChange: (year: number) => void;
}

export function YearViewGrid({ year, exceptions, selectedDates, onSelectDates, onYearChange }: YearViewGridProps) {
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
            <div className="px-4 pt-2">
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4 select-none">
                {months.map(month => (
                    <MonthCard 
                        key={month.toISOString()} 
                        month={month} 
                        year={year}
                        exceptionMap={exceptionMap}
                        selectedSet={selectedSet}
                        onMouseDown={handleMouseDown}
                        onMouseEnter={handleMouseEnter}
                    />
                ))}
            </div>
        </div>
    );
}

// Sub-component for individual Month (Lightweight)
function MonthCard({ month, exceptionMap, selectedSet, onMouseDown, onMouseEnter }: any) {
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
                     
                     let bgClass = "bg-muted/30 hover:bg-muted";
                     if (isSelected) {
                         bgClass = "bg-primary text-primary-foreground";
                     } else if (exception) {
                         // Use centralized style helper
                         const styles = getStatusStyles(exception.type, exception.isClosed);
                         bgClass = styles.badge; // Re-use badge style for cells or specific calendarItem logic if needed
                         // Simplified for Year View cells which are small
                         bgClass = `${styles.bg} ${styles.text} hover:bg-opacity-80`; 
                     }

                     return (
                         <SmartTooltip key={id} date={date} exception={exception}>
                             <div 
                                 className={cn(
                                     "aspect-square flex items-center justify-center rounded-sm cursor-pointer text-[10px] transition-colors",
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
