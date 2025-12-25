/**
 * Types - Module Quản lý Lịch hẹn
 * Định nghĩa các TypeScript interfaces cho hệ thống lịch hẹn Spa.
 */

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type CalendarViewType = "day" | "week" | "month" | "agenda" | "timeline";
export type ResourceType = "staff" | "bed";
export type ZoomLevel = 15 | 30 | 60 | 240;
export type DensityMode = "comfortable" | "compact";
export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly";
export type RecurrenceEndType = "never" | "count" | "until";

export interface BookingItem {
  serviceId: string;
  serviceName: string;
  price: number;
  duration: number;
  startTime?: Date;
  staffId?: string;
  resourceId?: string;
}

export interface Appointment {
  id: string;

  // Customer Info
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;

  // Service Items
  items: BookingItem[];
  totalPrice: number;
  totalDuration: number;

  // Legacy Fields (kept for compatibility)
  staffId: string;
  staffName: string;
  staffAvatar?: string;
  serviceId?: string;
  serviceName?: string;
  serviceColor?: string;
  resourceId?: string;
  resourceName?: string;

  // Time
  startTime: Date;
  endTime: Date;
  duration: number;

  status: AppointmentStatus;
  notes?: string;
  internalNotes?: string;

  // Recurrence
  isRecurring: boolean;
  recurrenceRule?: string;
  recurrenceParentId?: string;
  recurrenceIndex?: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  status: AppointmentStatus;
  staffId: string;
  staffName: string;
  resourceId?: string;
  isRecurring: boolean;
  appointment: Appointment;
}

export interface TimelineResource {
  id: string;
  type: ResourceType;
  name: string;
  avatar?: string;
  color?: string;
  isActive: boolean;
  skills?: string[];
}

export interface CalendarViewConfig {
  view: CalendarViewType;
  date: Date;
  zoomLevel: ZoomLevel;
  densityMode: DensityMode;
  showWeekends: boolean;
  startHour: number;
  endHour: number;
}

export interface RecurrenceConfig {
  frequency: RecurrenceFrequency;
  interval: number;
  byDay?: number[];
  endType: RecurrenceEndType;
  count?: number;
  until?: Date;
}

export interface ConflictInfo {
  eventId: string;
  conflictsWith: string[];
  type: "overlap" | "double_booking";
  severity: "warning" | "error";
  message: string;
}

export interface AppointmentFilters {
  staffIds: string[];
  serviceIds: string[];
  resourceIds: string[];
  statuses: AppointmentStatus[];
  searchQuery: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface GetAppointmentsParams {
  dateRange: DateRange;
  filters?: Partial<AppointmentFilters>;
}

export interface AppointmentFormData {
  customerId: string;
  serviceIds: string[];
  staffId: string;
  resourceId?: string;
  date: Date;
  startTime: string; // "HH:mm"
  notes?: string;
  isRecurring: boolean;
  recurrence?: RecurrenceConfig;
}

export interface UpdateAppointmentTimeData {
  id: string;
  startTime: Date;
  endTime: Date;
}

export interface CalendarState {
  view: CalendarViewType;
  date: Date;
  zoomLevel: ZoomLevel;
  densityMode: DensityMode;
  selectedEventId: string | null;
  isSheetOpen: boolean;
  sheetMode: "view" | "create" | "edit";
}

export interface DragState {
  isDragging: boolean;
  activeEventId: string | null;
  overSlotId: string | null;
  previewTime: { start: Date; end: Date } | null;
}

export interface TimeSlot {
  id: string;
  date: Date;
  hour: number;
  minute: number;
  isDisabled: boolean;
  isPast: boolean;
}

export interface AppointmentMetrics {
  todayTotal: number;
  todayPending: number;
  todayCompleted: number;
  occupancyRate: number;
  estimatedRevenue: number;
  noShowRate: number;
}

export interface AppointmentApiResponse {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  customer_avatar?: string;
  staff_id: string;
  staff_name: string;
  staff_avatar?: string;
  service_id: string;
  service_name: string;
  service_color: string;
  resource_id?: string;
  resource_name?: string;
  start_time: string;
  end_time: string;
  duration: number;
  status: AppointmentStatus;
  notes?: string;
  internal_notes?: string;
  is_recurring: boolean;
  recurrence_rule?: string;
  recurrence_parent_id?: string;
  recurrence_index?: number;
  created_at: string;
  updated_at: string;
  created_by: string;
}
