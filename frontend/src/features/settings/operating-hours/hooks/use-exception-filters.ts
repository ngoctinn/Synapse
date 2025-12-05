import { useState, useMemo } from "react";
import { ExceptionDate } from "../model/types";

export type FilterType = 'all' | 'holiday' | 'custom' | 'maintenance';
export type StatusFilter = 'all' | 'closed' | 'open';

export function useExceptionFilters(exceptions: ExceptionDate[]) {
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  const groupedExceptions = useMemo(() => {
    const groups = new Map<string, ExceptionDate[]>();
    
    // Filter before grouping
    const filteredExceptions = exceptions.filter(ex => {
      const typeMatch = filterType === 'all' ? true : ex.type === filterType;
      const statusMatch = statusFilter === 'all' ? true :
                          statusFilter === 'closed' ? ex.isClosed :
                          !ex.isClosed;
      return typeMatch && statusMatch;
    });

    // Sắp xếp theo ngày trước
    const sortedExceptions = [...filteredExceptions].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    sortedExceptions.forEach(ex => {
      const existing = groups.get(ex.id);
      if (existing) {
        existing.push(ex);
      } else {
        groups.set(ex.id, [ex]);
      }
    });
    
    return Array.from(groups.values());
  }, [exceptions, filterType, statusFilter]);

  return {
    filterType,
    setFilterType,
    statusFilter,
    setStatusFilter,
    groupedExceptions
  };
}
