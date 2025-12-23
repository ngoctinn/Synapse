/**
 * Operating Hours Mock Data
 * Tham chiếu: docs/research/operating-hours-design.md (Database Schema - Section 2.1)
 */

import { DaySchedule, ExceptionDate, OperatingHoursConfig } from "./types";

// Mock weekly schedule - phản ánh cấu trúc regular_operating_hours table
export const MOCK_WEEKLY_SCHEDULE: DaySchedule[] = [
  {
    dayOfWeek: 1,
    label: "Thứ Hai",
    isOpen: true,
    timeSlots: [
      { start: "08:00", end: "12:00" },
      { start: "13:30", end: "21:00" },
    ], // Split-shift example
  },
  {
    dayOfWeek: 2,
    label: "Thứ Ba",
    isOpen: true,
    timeSlots: [{ start: "08:00", end: "21:00" }],
  },
  {
    dayOfWeek: 3,
    label: "Thứ Tư",
    isOpen: true,
    timeSlots: [{ start: "08:00", end: "21:00" }],
  },
  {
    dayOfWeek: 4,
    label: "Thứ Năm",
    isOpen: true,
    timeSlots: [{ start: "08:00", end: "21:00" }],
  },
  {
    dayOfWeek: 5,
    label: "Thứ Sáu",
    isOpen: true,
    timeSlots: [{ start: "08:00", end: "21:00" }],
  },
  {
    dayOfWeek: 6,
    label: "Thứ Bảy",
    isOpen: true,
    timeSlots: [{ start: "09:00", end: "18:00" }],
  },
  { dayOfWeek: 7, label: "Chủ Nhật", isOpen: false, timeSlots: [] },
];

// Mock exceptions - phản ánh cấu trúc exception_dates table
export const MOCK_EXCEPTIONS: ExceptionDate[] = [
  {
    id: "exc-1",
    date: new Date("2025-12-24"),
    type: "SPECIAL_HOURS",
    reason: "Giáng sinh (về sớm)",
    isClosed: false,
    openTime: "09:00",
    closeTime: "16:00",
  },
  {
    id: "exc-2",
    date: new Date("2025-12-25"),
    type: "HOLIDAY",
    reason: "Lễ Giáng sinh",
    isClosed: true,
  },
  {
    id: "exc-3",
    date: new Date("2026-01-01"),
    type: "HOLIDAY",
    reason: "Tết Dương Lịch",
    isClosed: true,
  },
  {
    id: "exc-4",
    date: new Date("2026-01-29"),
    type: "HOLIDAY",
    reason: "Tết Nguyên Đán",
    isClosed: true,
  },
];

// Aggregate config
export const MOCK_OPERATING_HOURS: OperatingHoursConfig = {
  weeklySchedule: MOCK_WEEKLY_SCHEDULE,
  exceptions: MOCK_EXCEPTIONS,
};

// Legacy export for backwards compatibility (deprecated)
export const MOCK_CONFIG = MOCK_OPERATING_HOURS;
