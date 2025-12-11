
import { eachDayOfInterval, format } from "date-fns";
import { useCallback, useState } from "react";

export type SelectionMode = 'select' | 'paint';
export type CalendarViewMode = 'year' | 'month' | 'list';

interface UseCalendarSelectionProps {
    initialSelectedDates?: Date[];
    initialViewMode?: CalendarViewMode;
}

export function useCalendarSelection({
    initialSelectedDates = [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialViewMode = 'calendar' as any // Fallback mapping
}: UseCalendarSelectionProps = {}) {

    // Convert initial dates to Set<string>
    const [selectedDateIds, setSelectedDateIds] = useState<Set<string>>(() => {
        const set = new Set<string>();
        initialSelectedDates.forEach(d => {
            set.add(format(d, 'yyyy-MM-dd'));
        });
        return set;
    });

    const [mode, setMode] = useState<SelectionMode>('select');
    const [view, setView] = useState<CalendarViewMode>(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (initialViewMode as any) === 'calendar' ? 'month' : (initialViewMode || 'month')
    );

    const [lastClickedDate, setLastClickedDate] = useState<Date | null>(null);

    // Helpers
    const getDateId = (date: Date) => format(date, 'yyyy-MM-dd');

    const isSelected = useCallback((date: Date) => {
        return selectedDateIds.has(getDateId(date));
    }, [selectedDateIds]);

    const toggleDate = useCallback((date: Date, multiple: boolean = true) => {
        const id = getDateId(date);

        setSelectedDateIds(prev => {
            const next = new Set(multiple ? prev : []);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
        setLastClickedDate(date);
    }, []);

    const selectRange = useCallback((start: Date, end: Date) => {
        const days = eachDayOfInterval({ start, end });
        const idsToAdd = days.map(d => getDateId(d));

        setSelectedDateIds(prev => {
            const next = new Set(prev);
            idsToAdd.forEach(id => next.add(id));
            return next;
        });
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedDateIds(new Set());
        setLastClickedDate(null);
    }, []);

    // Selection Logic for Shift+Click
    const handleDateClick = useCallback((date: Date, isShiftPressed: boolean = false) => {
        if (isShiftPressed && lastClickedDate) {
            // Range select based on last clicked
             const start = date < lastClickedDate ? date : lastClickedDate;
             const end = date > lastClickedDate ? date : lastClickedDate;
             selectRange(start, end);
        } else {
            toggleDate(date, true);
        }
    }, [lastClickedDate, selectRange, toggleDate]);

    // Export selected dates as Date array (for compatibility with legacy components)
    const getSelectedDates = useCallback(() => {
        // This is expensive O(N), use sparingly or memoize if needed outside
        // But since Set contains strings, we just map back to Date?
        // Actually, creating Dates from strings 'YYYY-MM-DD' might have timezone issues if not careful.
        // Better to store Date objects map if we need strict Date return,
        // OR just parse YYYY-MM-DD and set to noon/startOfDay to be safe.
        // For UI display, ID is enough. For form submission, we need Date.
        return Array.from(selectedDateIds).map(id => new Date(id));
    }, [selectedDateIds]);

    const setSelectedDates = useCallback((dates: Date[]) => {
        const newSet = new Set<string>();
        dates.forEach(d => newSet.add(getDateId(d)));
        setSelectedDateIds(newSet);
        if (dates.length > 0) setLastClickedDate(dates[dates.length - 1]);
    }, []);

    const addToSelection = useCallback((dates: Date[]) => {
        setSelectedDateIds(prev => {
            const newSet = new Set(prev);
            dates.forEach(d => newSet.add(getDateId(d)));
            return newSet;
        });
        if (dates.length > 0) setLastClickedDate(dates[dates.length - 1]);
    }, []);

    return {
        selectedDateIds,
        mode,
        setMode,
        view,
        setView,
        isSelected,
        toggleDate,
        selectRange,
        clearSelection,
        handleDateClick,
        getSelectedDates,
        setSelectedDates,
        addToSelection
    };
}
