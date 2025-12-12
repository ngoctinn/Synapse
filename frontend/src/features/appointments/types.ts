/**
 * Types - Module Quản lý Lịch hẹn
 *
 * Định nghĩa các TypeScript interfaces cho hệ thống lịch hẹn Spa.
 * Tuân thủ naming convention: camelCase cho frontend, snake_case cho API response.
 */

// ============================================
// ENUMS & CONSTANTS TYPES
// ============================================

/** Trạng thái cuộc hẹn */
export type AppointmentStatus =
  | "pending" // Chờ xác nhận
  | "confirmed" // Đã xác nhận
  | "in_progress" // Đang thực hiện
  | "completed" // Hoàn thành
  | "cancelled" // Đã hủy
  | "no_show"; // Khách không đến

/** Loại chế độ xem lịch */
export type CalendarViewType =
  | "day"
  | "week"
  | "month"
  | "agenda"
  | "timeline";

/** Loại tài nguyên */
export type ResourceType = "staff" | "room";

/** Mức zoom timeline (phút/đơn vị) */
export type ZoomLevel = 15 | 30 | 60 | 240;

/** Chế độ mật độ hiển thị */
export type DensityMode = "comfortable" | "compact";

/** Tần suất lặp lại */
export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly";

/** Loại kết thúc lịch lặp */
export type RecurrenceEndType = "never" | "count" | "until";

// ============================================
// CORE ENTITIES
// ============================================

/** Thực thể Cuộc hẹn (từ Database) */
  /** Item dịch vụ trong booking */
export interface BookingItem {
  serviceId: string;
  serviceName: string;
  price: number;
  duration: number;
  startTime?: Date;
  staffId?: string; // Tùy chọn: nhân viên riêng cho từng dịch vụ
  resourceId?: string; // Tùy chọn: phòng riêng cho từng dịch vụ
}

/** Thực thể Cuộc hẹn (từ Database) */
export interface Appointment {
  id: string;

  // Thông tin khách hàng
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAvatar?: string;

  // Thông tin items (Đa dịch vụ)
  items: BookingItem[]; // NEW: 1-to-Many support
  totalPrice: number;
  totalDuration: number;

  // --- LEGACY FIELDS (Backward Compatibility) ---
  staffId: string;      // Main staff
  staffName: string;
  staffAvatar?: string;
  serviceId?: string;   // Deprecated: use items[0].serviceId
  serviceName?: string; // Deprecated
  serviceColor?: string;
  resourceId?: string;  // Main resource
  resourceName?: string;
  // ---------------------------------------------

  // Thời gian
  startTime: Date;
  endTime: Date;
  duration: number; // Tổng thời gian

  // Trạng thái
  status: AppointmentStatus;

  // Ghi chú
  notes?: string;
  internalNotes?: string; // Ghi chú nội bộ (KTV ghi)

  // Lịch lặp lại
  isRecurring: boolean;
  recurrenceRule?: string; // RRULE string (iCalendar format)
  recurrenceParentId?: string;
  recurrenceIndex?: number;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

/** Event hiển thị trên Calendar (simplified từ Appointment) */
export interface CalendarEvent {
  id: string;
  title: string; // customerName + serviceName (hoặc "Combo..")
  start: Date;
  end: Date;
  color: string; // serviceColor
  status: AppointmentStatus;
  staffId: string;
  staffName: string;
  resourceId?: string;
  isRecurring: boolean;

  // Reference đến Appointment gốc
  appointment: Appointment;
}

/** Tài nguyên Timeline (KTV hoặc Phòng) */
export interface TimelineResource {
  id: string;
  type: ResourceType;
  name: string;
  avatar?: string;
  color?: string;
  isActive: boolean;
  skills?: string[]; // Cho staff: danh sách skill IDs
}

// ============================================
// CONFIGURATION TYPES
// ============================================

/** Cấu hình View Calendar */
export interface CalendarViewConfig {
  view: CalendarViewType;
  date: Date; // Ngày/tuần/tháng đang xem
  zoomLevel: ZoomLevel;
  densityMode: DensityMode;
  showWeekends: boolean;
  startHour: number; // Mặc định: 8
  endHour: number; // Mặc định: 21
}

/** Cấu hình Lịch lặp lại (RRULE) */
export interface RecurrenceConfig {
  frequency: RecurrenceFrequency;
  interval: number; // Mỗi X [frequency]
  byDay?: number[]; // 0=CN, 1=T2, ..., 6=T7
  endType: RecurrenceEndType;
  count?: number; // Số lần lặp (nếu endType = 'count')
  until?: Date; // Ngày kết thúc (nếu endType = 'until')
}

/** Thông tin xung đột lịch */
export interface ConflictInfo {
  eventId: string;
  conflictsWith: string[]; // IDs của các events bị xung đột
  type: "overlap" | "double_booking";
  severity: "warning" | "error";
  message: string;
}

// ============================================
// FILTER & QUERY TYPES
// ============================================

/** State bộ lọc lịch hẹn */
export interface AppointmentFilters {
  staffIds: string[];
  serviceIds: string[];
  resourceIds: string[];
  statuses: AppointmentStatus[];
  searchQuery: string;
}

/** Khoảng thời gian */
export interface DateRange {
  start: Date;
  end: Date;
}

/** Params cho query appointments */
export interface GetAppointmentsParams {
  dateRange: DateRange;
  filters?: Partial<AppointmentFilters>;
}

// ============================================
// FORM TYPES
// ============================================

/** Dữ liệu form tạo/sửa cuộc hẹn */
export interface AppointmentFormData {
  customerId: string;
  serviceIds: string[]; // Cho phép chọn nhiều dịch vụ
  staffId: string;
  resourceId?: string;
  date: Date;
  startTime: string; // "HH:mm" format
  notes?: string;
  isRecurring: boolean;
  recurrence?: RecurrenceConfig;
}

/** Dữ liệu cập nhật thời gian (khi drag-drop) */
export interface UpdateAppointmentTimeData {
  id: string;
  startTime: Date;
  endTime: Date;
}

// ============================================
// UI STATE TYPES
// ============================================

/** State của Calendar */
export interface CalendarState {
  view: CalendarViewType;
  date: Date;
  zoomLevel: ZoomLevel;
  densityMode: DensityMode;
  selectedEventId: string | null;
  isSheetOpen: boolean;
  sheetMode: "view" | "create" | "edit";
}

/** State của Drag & Drop */
export interface DragState {
  isDragging: boolean;
  activeEventId: string | null;
  overSlotId: string | null;
  previewTime: { start: Date; end: Date } | null;
}

/** Time Slot cho grid */
export interface TimeSlot {
  id: string; // "YYYY-MM-DD-HH-mm"
  date: Date;
  hour: number;
  minute: number;
  isDisabled: boolean; // Ngày đã qua, giờ nghỉ
  isPast: boolean;
}

// ============================================
// DASHBOARD METRICS
// ============================================

/** Thống kê Dashboard */
export interface AppointmentMetrics {
  todayTotal: number;
  todayPending: number;
  todayCompleted: number;
  occupancyRate: number; // 0-100%
  estimatedRevenue: number;
  noShowRate: number; // 0-100%
}

// ============================================
// API RESPONSE TYPES (từ Backend)
// ============================================

/** Response từ API - Appointment (snake_case) */
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
  start_time: string; // ISO string
  end_time: string; // ISO string
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
