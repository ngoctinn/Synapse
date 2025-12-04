export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface TimeSlot {
  start: string; // Định dạng "HH:mm"
  end: string;   // Định dạng "HH:mm"
}

export interface DaySchedule {
  day: DayOfWeek;
  isOpen: boolean;
  timeSlots: TimeSlot[]; // Hỗ trợ nhiều khung giờ (ví dụ: ca sáng/ca chiều)
}

export interface ExceptionDate {
  id: string;
  date: Date;
  reason: string;
  type: 'holiday' | 'maintenance' | 'custom';
  isClosed: boolean; // True nếu đóng cửa cả ngày, False nếu chỉ thay đổi giờ làm việc
  modifiedHours?: TimeSlot[];
}

export interface OperatingHoursConfig {
  defaultSchedule: DaySchedule[];
  exceptions: ExceptionDate[];
}
