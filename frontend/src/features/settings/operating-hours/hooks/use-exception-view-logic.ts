"use client";

import { useMemo, useState, useEffect } from "react";
import { ExceptionDate } from "../model/types";
import { useFilterParams } from "@/shared/lib/hooks/use-filter-params";
import { 
    isWithinInterval, 
    startOfDay, 
    endOfDay, 
    parseISO, 
    startOfYear, 
    endOfYear,
    isSameDay,
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    isSameMonth,
    isSameYear
} from "date-fns";
import { FilterUnit } from "./use-exception-filters";
import { DateRange } from "react-day-picker";

interface UseExceptionViewLogicProps {
  exceptions: ExceptionDate[];
}

export function useExceptionViewLogic({ exceptions }: UseExceptionViewLogicProps) {
  // --- 1. Filter Logic (URL Params) ---
  const { searchParams, activeCount, updateParam, updateParams, clearFilters } = useFilterParams({
    filterKeys: ['status', 'type', 'from', 'to', 'search']
  });

  const [initialized, setInitialized] = useState(false);
  
  // Derived Values from URL
  const statusFilter = searchParams.get('status');
  const typeFilter = searchParams.get('type')?.split(',') || [];
  const searchQuery = searchParams.get('search') || '';
  const fromDate = searchParams.get('from') ? parseISO(searchParams.get('from')!) : undefined;
  const toDate = searchParams.get('to') ? parseISO(searchParams.get('to')!) : undefined;

  const dateRange: DateRange | undefined = useMemo(() => 
    fromDate && toDate ? { from: fromDate, to: toDate } : undefined,
  [fromDate, toDate]);

  // Helper to detect unit from range
  const detectFilterUnit = (range: DateRange | undefined): FilterUnit => {
      if (!range?.from || !range?.to) return 'year';

      const start = range.from;
      const end = range.to;
      const now = new Date(); // Only used for relative checks if strictly needed, but here we check shape

      // Check if it matches a full year
      if (isSameDay(start, startOfYear(start)) && isSameDay(end, endOfYear(end))) {
          return 'year';
      }

      // Check if it matches a full month
      if (isSameDay(start, startOfMonth(start)) && isSameDay(end, endOfMonth(end))) {
          return 'month';
      }

      // Check if it matches a full week (Mon-Sun)
      if (isSameDay(start, startOfWeek(start, { weekStartsOn: 1 })) && 
          isSameDay(end, endOfWeek(end, { weekStartsOn: 1 }))) {
          return 'week';
      }

      // Check if input is a single day
      if (isSameDay(start, end)) {
          return 'day';
      }

      return 'custom';
  };

  // Local state for "FilterUnit" initialized from URL range
  const [filterUnit, setFilterUnit] = useState<FilterUnit>(() => detectFilterUnit(dateRange));

  // Sync initialization
  useEffect(() => {
      if (!initialized) {
          if (!searchParams.has('from') && !searchParams.has('to')) {
               // Default to current year if completely empty
              const now = new Date();
              updateParam('from', startOfYear(now).toISOString());
              updateParam('to', endOfYear(now).toISOString());
              setFilterUnit('year');
          } else if (dateRange) {
              // If params exist, detect unit once
              setFilterUnit(detectFilterUnit(dateRange));
          }
          setInitialized(true);
      }
  }, [searchParams, initialized, updateParam, dateRange]);


  // Filter Data
  const filteredExceptions = useMemo(() => {
    return exceptions.filter(ex => {
       // 1. Status
       if (statusFilter === 'closed' && !ex.isClosed) return false;
       if (statusFilter === 'open' && ex.isClosed) return false;

       // 2. Type
       if (typeFilter.length > 0 && !typeFilter.includes(ex.type)) return false;

       // 3. Date
       if (dateRange?.from && dateRange?.to) {
           const inRange = isWithinInterval(ex.date, { 
             start: startOfDay(dateRange.from), 
             end: endOfDay(dateRange.to) 
           });
           if (!inRange) return false;
       }

       // 4. Search
       if (searchQuery) {
           const query = searchQuery.toLowerCase();
           return ex.reason?.toLowerCase().includes(query) || false;
       }

       return true;
    });
  }, [exceptions, statusFilter, typeFilter, dateRange, searchQuery]);

  // --- 2. View Mode Logic ---
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const handleViewModeChange = (newMode: 'calendar' | 'list') => {
      if (newMode === 'calendar') {
          // Calendar view defaults to full year view
          let targetYear = new Date().getFullYear();
          if (dateRange?.from) {
              targetYear = dateRange.from.getFullYear();
          }

          const start = startOfYear(new Date(targetYear, 0, 1));
          const end = endOfYear(new Date(targetYear, 0, 1));
          
          updateParams({
            from: start.toISOString(),
            to: end.toISOString()
          });
          setFilterUnit('year');
      }
      setViewMode(newMode);
  };

  // Determine if we should show Year Grid
  const isYearView = useMemo(() => {
      if (viewMode === 'list') return false;
      if (filterUnit === 'year') return true;
      if (dateRange?.from && dateRange?.to) {
          const days = Math.abs(dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24);
          return days > 35; 
      }
      return false; // Default to Month view
  }, [filterUnit, dateRange, viewMode]);

  // Handlers
  const setDateRangeParam = (range: DateRange | undefined) => {
      const updates: Record<string, string | null> = {};
      
      if (range?.from) updates['from'] = range.from.toISOString();
      else updates['from'] = null;
      
      if (range?.to) updates['to'] = range.to.toISOString();
      else updates['to'] = null;

      updateParams(updates);
  };

  const setStatusParam = (val: string | null) => updateParam('status', val);
  const setTypeParam = (vals: string[] | null) => updateParam('type', vals && vals.length > 0 ? vals.join(',') : null);
  const setSearchParam = (val: string) => updateParam('search', val || null);

  return {
    // State
    filteredExceptions,
    viewMode,
    isYearView,
    dateRange,
    statusFilter,
    typeFilter,
    searchQuery,
    activeCount,
    filterUnit,
    
    // Setters
    setViewMode: handleViewModeChange,
    setFilterUnit,
    setDateRange: setDateRangeParam,
    setStatusFilter: setStatusParam,
    setTypeFilter: setTypeParam,
    setSearchQuery: setSearchParam,
    clearFilters,
  };
}
