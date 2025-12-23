/**
 * Operating Hours - Public API
 *
 * Tham chiếu:
 * - Database Schema: docs/research/operating-hours-design.md
 * - UX/UI Patterns: docs/research/operating-hours-uxui.md
 */

// Types
export * from "./types";

// Constants & Utilities
export {
  DEFAULT_CLOSE_TIME,
  DEFAULT_EXCEPTION_CLOSE,
  DEFAULT_EXCEPTION_OPEN,
  DEFAULT_OPEN_TIME,
  EXCEPTION_TYPE_LABELS,
  EXCEPTION_TYPE_VARIANTS,
  validateTimeSlots,
} from "./constants";

// Actions
export { getOperatingHours, updateOperatingHours } from "./actions";

// Components
export { DayRow } from "./day-row";
export { ExceptionSheet } from "./exception-sheet";
export { ExceptionsPanel } from "./exceptions-panel";
export { WeeklySchedule } from "./weekly-schedule";

// Mocks (for development)
export {
  MOCK_EXCEPTIONS,
  MOCK_OPERATING_HOURS,
  MOCK_WEEKLY_SCHEDULE,
} from "./mocks";
