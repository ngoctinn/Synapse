"use client";

import { useMemo, useRef, useCallback, useEffect } from "react";
import { Calendar, CalendarDayButton } from "@/shared/ui/calendar";
import { Card, CardContent } from "@/shared/ui/card";
import { ExceptionDate } from "../model/types";
import { vi } from "date-fns/locale";
import { motion } from "framer-motion";
import { SmartTooltip } from "./smart-tooltip";
import { getCalendarModifiers, getCalendarModifierClassNames } from "../utils/style-helpers";

interface ExceptionsCalendarProps {
  exceptions: ExceptionDate[];
  selectedDates?: Date[];
  displayDate?: Date;
  onSelectDates: (dates: Date[]) => void;
  onEdit: (exception: ExceptionDate) => void;
}

export function ExceptionsCalendar({ 
  exceptions, 
  selectedDates = [], 
  displayDate,
  onSelectDates,
  onEdit 
}: ExceptionsCalendarProps) {
  
  // Drag selection state
  const isDragging = useRef(false);
  const dragAction = useRef<'select' | 'deselect'>('select');

  // Highlight modifiers for calendar
  const modifiers = useMemo(() => getCalendarModifiers(exceptions), [exceptions]);
  const modifiersClassNames = useMemo(() => getCalendarModifierClassNames(), []);

  const handleDayDoubleClick = (day: Date) => {
    const existing = exceptions.find(e => 
      e.date.getDate() === day.getDate() && 
      e.date.getMonth() === day.getMonth() && 
      e.date.getFullYear() === day.getFullYear()
    );

    if (existing) {
      onEdit(existing);
      return;
    }
  };

  const handleMouseDown = useCallback((day: Date) => {
    isDragging.current = true;
    const isSelected = selectedDates.some(d => d.getTime() === day.getTime());
    dragAction.current = isSelected ? 'deselect' : 'select';

    const newDates = isSelected 
        ? selectedDates.filter(d => d.getTime() !== day.getTime())
        : [...selectedDates, day];
    
    onSelectDates(newDates);
  }, [selectedDates, onSelectDates]);

  const handleMouseEnter = useCallback((day: Date) => {
    if (!isDragging.current) return;

    const isSelected = selectedDates.some(d => d.getTime() === day.getTime());
    
    if (dragAction.current === 'select' && !isSelected) {
       onSelectDates([...selectedDates, day]);
    } else if (dragAction.current === 'deselect' && isSelected) {
       onSelectDates(selectedDates.filter(d => d.getTime() !== day.getTime()));
    }
  }, [selectedDates, onSelectDates]);

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }
  }, [handleMouseUp]);

  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
      // Only update position if dragging or close to dragging
      if (tooltipRef.current) {
         if (isDragging.current) {
             tooltipRef.current.style.transform = `translate(${e.clientX + 16}px, ${e.clientY + 16}px)`;
             tooltipRef.current.style.opacity = '1';
         } else {
             tooltipRef.current.style.opacity = '0';
         }
      }
  }, []);

  // Update tooltip content when selection changes
  useEffect(() => {
      if (tooltipRef.current && isDragging.current) {
           // We can manually update textContent to avoid re-renders too
           const countSpan = tooltipRef.current.querySelector('span');
           if (countSpan) countSpan.textContent = selectedDates.length.toString();
      }
  }, [selectedDates.length]);

  return (
    <div className="w-full" onMouseMove={handleMouseMove}>
        {/* Cursor Follower Tooltip */}
        <div 
            ref={tooltipRef} 
            className="hidden sm:flex fixed top-0 left-0 z-50 pointer-events-none opacity-0 transition-opacity duration-150 bg-primary/90 text-primary-foreground px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm items-center gap-1.5"
            style={{ willChange: 'transform, opacity' }}
        >
            <span className="text-sm">{selectedDates.length}</span>
            <span className="font-normal opacity-80">ngày</span>
        </div>

        <Card className="h-full border-none shadow-none bg-transparent">
          <CardContent className="p-0">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="border rounded-3xl p-4 sm:p-6 bg-card/40 backdrop-blur-xl shadow-2xl ring-1 ring-white/20 dark:ring-white/5 select-none"
             >
                <Calendar
                  mode="multiple"
                  selected={selectedDates}
                  onSelect={(dates) => onSelectDates(dates || [])}
                  required={false}
                  
                  // Controlled mode
                  month={displayDate || new Date()} 
                  
                  modifiers={modifiers}
                  modifiersClassNames={modifiersClassNames}
                  className="rounded-md w-full flex justify-center p-2 text-foreground" 

                locale={vi}
                classNames={{
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-lg shadow-primary/20",
                  day_today: "bg-accent/50 text-accent-foreground font-semibold",
                  day: "h-9 w-9 sm:h-10 sm:w-10 p-0 font-normal aria-selected:opacity-100 transition-all duration-200 hover:scale-105",
                }}
                components={{
                  DayButton: (props: any) => {
                      const { day } = props;
                      const date = day.date;
                      
                      const existing = exceptions.find(e => 
                        e.date.getDate() === date.getDate() && 
                        e.date.getMonth() === date.getMonth() && 
                        e.date.getFullYear() === date.getFullYear()
                      );
                      
                      return (
                        <SmartTooltip exception={existing} date={date}>
                             <CalendarDayButton
                              {...props}
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleMouseDown(date);
                              }}
                              onDoubleClick={() => handleDayDoubleClick(date)}
                              onMouseDown={() => handleMouseDown(date)}
                              onMouseEnter={() => handleMouseEnter(date)}
                            />
                        </SmartTooltip>
                      )
                  }
                }}
              />
            </motion.div>
          </CardContent>
        </Card>
    </div>
  );
}

