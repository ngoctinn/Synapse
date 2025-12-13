/**
 * Public API - Module Quản lý Lịch hẹn
 */

// COMPONENTS
export { AppointmentsPage } from "./components/appointments-page";
export {
    AgendaView, CalendarView, DateHeader, DayView, EmptyState, MonthView, TimeGrid, WeekView
} from "./components/calendar";
export { MetricsCards } from "./components/dashboard";
export { CalendarDndContext, DraggableEventCard, DroppableSlot } from "./components/dnd";
export { EventCard, EventPopover } from "./components/event";
export { AppointmentForm, AppointmentSheet, ConflictWarning } from "./components/sheet";
export { ResourceTimeline, TimelineHeader, TimelineRow } from "./components/timeline";
export { DateNavigator, FilterBar, ViewSwitcher } from "./components/toolbar";

// HOOKS
export { useCalendarDnd, useCalendarState } from "./hooks";

// TYPES
export type {
    Appointment, AppointmentFilters, AppointmentFormData, AppointmentMetrics, AppointmentStatus,
    CalendarEvent, CalendarState, CalendarViewConfig, CalendarViewType, ConflictInfo, DateRange,
    DensityMode, DragState, RecurrenceConfig, RecurrenceEndType, RecurrenceFrequency, ResourceType, TimeSlot, TimelineResource, UpdateAppointmentTimeData, ZoomLevel
} from "./types";

// SCHEMAS
export {
    appointmentFilterSchema, appointmentFormSchema, recurrenceSchema, updateAppointmentTimeSchema,
    validateFutureDateTime, validateWorkingHours
} from "./schemas";
export type { AppointmentFilterValues, AppointmentFormValues, RecurrenceValues, UpdateAppointmentTimeValues } from "./schemas";

// CONSTANTS
export {
    ANIMATION_DURATION, APPOINTMENT_STATUS_CONFIG, APPOINTMENT_STATUS_OPTIONS, CALENDAR_VIEW_CONFIG,
    DEFAULT_SERVICE_COLORS, DEFAULT_TIME_INTERVAL, DEFAULT_WORKING_HOURS, DENSITY_MODE_OPTIONS,
    EMPTY_STATE_MESSAGES, HOUR_HEIGHT, KEYBOARD_SHORTCUTS, MAX_EVENTS_IN_MONTH_CELL,
    MIN_TOUCH_TARGET_SIZE, RECURRENCE_END_OPTIONS, RECURRENCE_FREQUENCY_OPTIONS, TIME_SLOT_INTERVALS,
    TOOLTIP_DELAY, WEEKDAYS, ZOOM_LEVEL_OPTIONS
} from "./constants";

// ACTIONS
export {
    cancelAppointment, checkConflicts, checkInAppointment, createAppointment, deleteAppointment,
    getAppointmentById, getAppointmentMetrics, getAppointments, getResourceList, getServiceList,
    getStaffList, markNoShow, searchCustomers, updateAppointment, updateAppointmentTime
} from "./actions";

