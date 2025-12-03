export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TimeSlot {
  start: string; // Format "HH:mm"
  end: string;   // Format "HH:mm"
}

export interface DaySchedule {
  day: DayOfWeek;
  isOpen: boolean;
  timeSlots: TimeSlot[]; // Support multiple slots (e.g., morning/afternoon shift) but MVP can start with 1
}

export interface ExceptionDate {
  id: string;
  date: Date;
  reason: string;
  type: 'holiday' | 'maintenance' | 'custom';
  isClosed: boolean; // True if completely closed, False if modified hours
  modifiedHours?: TimeSlot[];
}

export interface OperatingHoursConfig {
  defaultSchedule: DaySchedule[];
  exceptions: ExceptionDate[];
}
