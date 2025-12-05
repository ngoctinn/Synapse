
"use client";

import { useMemo, useRef } from "react";
import { format, eachMonthOfInterval, startOfYear, endOfYear, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/shared/lib/utils";
import { ExceptionDate } from "../model/types";
import { SmartTooltip } from "./smart-tooltip";
import { getStatusStyles } from "../utils/style-helpers";

interface YearViewGridProps {
    year: number;
    exceptions: ExceptionDate[];
    selectedDates: Date[];
    onSelectDates: (dates: Date[]) => void;
}

export function YearViewGrid({ year, exceptions, selectedDates, onSelectDates }: YearViewGridProps) {
    const months = useMemo(() => {
        const start = startOfYear(new Date(year, 0));
        return eachMonthOfInterval({ start, end: endOfYear(start) });
    }, [year]);

    // Drag State
    const isDragging = useRef(false);
    const dragStartDate = useRef<Date | null>(null);
    
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
        onSelectDates([date]);
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
        
        onSelectDates(range);
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

    return (
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
