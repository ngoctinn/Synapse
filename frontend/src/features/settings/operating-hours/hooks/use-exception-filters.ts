"use client";

import { useState, useMemo } from "react";
import { ExceptionDate } from "../model/types";
import { DateRange } from "react-day-picker";
import { isWithinInterval, startOfDay, endOfDay } from "date-fns";

export type FilterUnit = 'day' | 'week' | 'month' | 'year' | 'custom' | 'all';

export function useExceptionFilters(exceptions: ExceptionDate[]) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'closed' | 'open'>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [filterUnit, setFilterUnit] = useState<FilterUnit>('all'); // Default to 'all' or 'month' based on reqs, usually 'all' if no range

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  const filteredExceptions = useMemo(() => {
    return exceptions.filter(ex => {
      // 1. Filter by Type
      const typeMatch = selectedTypes.length === 0 ? true : selectedTypes.includes(ex.type);
      
      // 2. Filter by Status
      const statusMatch = statusFilter === 'all' ? true :
                          statusFilter === 'closed' ? ex.isClosed :
                          !ex.isClosed;

      // 3. Filter by Date Range
      let dateMatch = true;
      if (dateRange?.from) {
        // Handle undefined 'to' date (implicitly same day)
        // Check if date is within range
        const checkDate = startOfDay(ex.date);
        const fromDate = startOfDay(dateRange.from);
        // If range.to is undefined, it means user selected one start date, 
        // usually range picker behaves: select start -> select end.
        // If only start is selected, we can filter from that date onwards or just that date?
        // Usually range filter implies "Show items within this range".
        // If to is missing, let's treat it as "From this date" or just same date.
        // Let's assume to = from if missing for exact match, OR end of time?
        // Re-reading usage: Date Range Picker usually sets both. 
        // If 'to' is undefined, react-day-picker treats it as single day selection in progress.
        // Let's treat it as single day if 'to' is undefined.
        const toDate = dateRange.to ? endOfDay(dateRange.to) : endOfDay(dateRange.from);
        
        dateMatch = isWithinInterval(checkDate, { start: fromDate, end: toDate });
      }

      return typeMatch && statusMatch && dateMatch;
    });
  }, [exceptions, selectedTypes, statusFilter, dateRange]);

  return {
    selectedTypes,
    setSelectedTypes,
    toggleTypeFilter,
    statusFilter,
    setStatusFilter,
    dateRange,
    setDateRange,
    filteredExceptions,
    filterUnit,
    setFilterUnit
  };
}
