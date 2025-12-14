/**
 * Operating Hours Types
 * Tham chiếu: docs/research/operating-hours-design.md (Database Schema)
 * Tham chiếu: docs/research/operating-hours-uxui.md (UX/UI Patterns - Section 5)
 */

// ===== WEEKLY SCHEDULE =====

export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export const DAY_LABELS: Record<DayOfWeek, string> = {
  1: "Thứ Hai",
  2: "Thứ Ba",
  3: "Thứ Tư",
  4: "Thứ Năm",
  5: "Thứ Sáu",
  6: "Thứ Bảy",
  7: "Chủ Nhật",
};

export interface TimeSlot {
  start: string; // "HH:mm" - maps to open_time in DB
  end: string;   // "HH:mm" - maps to close_time in DB
}

export interface DaySchedule {
  dayOfWeek: DayOfWeek; // maps to day_of_week (1-7)
  label: string;
  isOpen: boolean;      // inverse of is_closed
  timeSlots: TimeSlot[]; // multiple periods support (period_number)
}

// ===== EXCEPTIONS =====

export type ExceptionType = "HOLIDAY" | "MAINTENANCE" | "SPECIAL_HOURS" | "CUSTOM";

export interface ExceptionDate {
  id: string;
  date: Date;           // maps to exception_date
  type: ExceptionType;  // maps to exception_type enum
  reason: string;       // maps to reason VARCHAR(255)
  isClosed: boolean;    // maps to is_closed
  openTime?: string;    // maps to open_time (when isClosed=false)
  closeTime?: string;   // maps to close_time (when isClosed=false)
}

// ===== CONFIG (Aggregate for Frontend State) =====

export interface OperatingHoursConfig {
  weeklySchedule: DaySchedule[];
  exceptions: ExceptionDate[];
}

// Backwards compatibility alias (deprecated - sẽ xóa sau khi refactor xong)
export type { DaySchedule as DayScheduleRow };
