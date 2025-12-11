/**
 * Public API - Module Quản lý Lịch hẹn
 *
 * Export tất cả các thành phần công khai của module.
 * Các module bên ngoài chỉ được import qua file này.
 */

// ============================================
// COMPONENTS
// ============================================

export { AppointmentsPage } from "./components/appointments-page";

// Calendar Components
export {
  AgendaView, CalendarView, DateHeader,
  DayView, MonthView, TimeGrid, WeekView
} from "./components/calendar";

// Toolbar Components
export { DateNavigator, ViewSwitcher } from "./components/toolbar";

// Timeline Components
export {
  ResourceTimeline,
  TimelineHeader,
  TimelineRow
} from "./components/timeline";

// Event Components
export { EventCard } from "./components/event";

// ============================================
// HOOKS
// ============================================

export { useCalendarState } from "./hooks";

// ============================================
// TYPES
// ============================================

export type {
  Appointment,
  AppointmentFilters,
  AppointmentFormData,
  AppointmentMetrics,
  AppointmentStatus,
  CalendarEvent,
  CalendarState,
  CalendarViewConfig,
  CalendarViewType,
  ConflictInfo,
  DateRange,
  DensityMode,
  DragState,
  RecurrenceConfig,
  RecurrenceEndType,
  RecurrenceFrequency,
  ResourceType,
  TimelineResource,
  TimeSlot,
  UpdateAppointmentTimeData,
  ZoomLevel
} from "./types";

// ============================================
// SCHEMAS
// ============================================

export {
  appointmentFilterSchema,
  appointmentFormSchema,
  recurrenceSchema,
  updateAppointmentTimeSchema,
  validateFutureDateTime,
  validateWorkingHours
} from "./schemas";

export type {
  AppointmentFilterValues,
  AppointmentFormValues,
  RecurrenceValues,
  UpdateAppointmentTimeValues
} from "./schemas";

// ============================================
// CONSTANTS
// ============================================

export {
  ANIMATION_DURATION,
  APPOINTMENT_STATUS_CONFIG,
  APPOINTMENT_STATUS_OPTIONS,
  CALENDAR_VIEW_CONFIG,
  DEFAULT_SERVICE_COLORS,
  DEFAULT_TIME_INTERVAL,
  DEFAULT_WORKING_HOURS,
  DENSITY_MODE_OPTIONS,
  EMPTY_STATE_MESSAGES,
  HOUR_HEIGHT,
  KEYBOARD_SHORTCUTS,
  MAX_EVENTS_IN_MONTH_CELL,
  MIN_TOUCH_TARGET_SIZE,
  RECURRENCE_END_OPTIONS,
  RECURRENCE_FREQUENCY_OPTIONS,
  TIME_SLOT_INTERVALS,
  TOOLTIP_DELAY,
  WEEKDAYS,
  ZOOM_LEVEL_OPTIONS
} from "./constants";

// ============================================
// ACTIONS
// ============================================

export {
  checkConflicts,
  createAppointment,
  deleteAppointment,
  getAppointmentById,
  getAppointmentMetrics,
  getAppointments,
  getResourceList,
  getServiceList,
  getStaffList,
  searchCustomers,
  updateAppointment,
  updateAppointmentTime
} from "./actions";

