import { ExceptionDate, TimeSlot } from "../model/types";
import { format, isSameDay, addDays, getYear, compareAsc } from "date-fns";
import { vi } from "date-fns/locale";

export interface GroupedException {
  id: string; // Composite ID or ID of the first item
  reason: string;
  type: 'holiday' | 'maintenance' | 'custom';
  isClosed: boolean;
  modifiedHours?: TimeSlot[]; // Add this
  dates: Date[];
  originalIds: string[];
  year: number; // For timeline grouping
}

const hashTimeSlots = (slots?: TimeSlot[]) => {
    if (!slots || slots.length === 0) return 'default';
    return slots.map(s => `${s.start}-${s.end}`).join('|');
};

/**
 * Groups a flat list of exceptions by reason, type, status AND time slots.
 */
export function groupExceptions(exceptions: ExceptionDate[]): GroupedException[] {
  const groups: Record<string, GroupedException> = {};

  // Sort exceptions by date first
  const sortedExceptions = [...exceptions].sort((a, b) => a.date.getTime() - b.date.getTime());

  sortedExceptions.forEach((ex) => {
    const reasonKey = (ex.reason || 'Trống').trim().toLowerCase();
    const timeHash = ex.isClosed ? 'closed' : hashTimeSlots(ex.modifiedHours);
    // Include timeHash in key to separate different timings
    const compositeKey = `${reasonKey}|${ex.type}|${timeHash}|${getYear(ex.date)}`;

    if (!groups[compositeKey]) {
      groups[compositeKey] = {
        id: ex.id,
        reason: ex.reason || 'Ngoại lệ tùy chỉnh',
        type: ex.type,
        isClosed: ex.isClosed,
        modifiedHours: ex.modifiedHours,
        dates: [],
        originalIds: [],
        year: getYear(ex.date),
      };
    }

    groups[compositeKey].dates.push(ex.date);
    groups[compositeKey].originalIds.push(ex.id);
  });

  // Convert to array and sort by the earliest date in each group
  return Object.values(groups).sort((a, b) => {
    const dateA = a.dates[0];
    const dateB = b.dates[0];
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Examples: 
 * - [01/01, 02/01, 03/01] -> "01 thg 01 - 03 thg 01"
 * - [05/01] -> "05 thg 01"
 */
export function getFormattedDateRanges(dates: Date[]): string[] {
  if (dates.length === 0) return [];
  
  // Ensure dates are sorted
  const sortedDates = [...dates].sort(compareAsc);
  
  const ranges: string[] = [];
  let startDate = sortedDates[0];
  let prevDate = sortedDates[0];

  for (let i = 1; i < sortedDates.length; i++) {
    const currentDate = sortedDates[i];
    
    // Check if consecutive (difference is exactly 1 day)
    const expectedDate = addDays(prevDate, 1);
    
    if (!isSameDay(currentDate, expectedDate)) {
      // Break in the chain, push the previous range
      ranges.push(formatRange(startDate, prevDate));
      startDate = currentDate;
    }
    
    prevDate = currentDate;
  }
  
  // Push the final range
  ranges.push(formatRange(startDate, prevDate));
  
  return ranges;
}

function formatRange(start: Date, end: Date): string {
  if (isSameDay(start, end)) {
    return format(start, "dd/MM", { locale: vi });
  }
  return `${format(start, "dd/MM", { locale: vi })} - ${format(end, "dd/MM", { locale: vi })}`;
}
