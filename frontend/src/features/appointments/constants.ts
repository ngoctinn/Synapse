/**
 * Constants - Module Quản lý Lịch hẹn
 *
 * Định nghĩa các hằng số, mappings và cấu hình mặc định.
 * Tất cả labels đều bằng Tiếng Việt.
 */

import type {
    AppointmentStatus,
    CalendarViewType,
    DensityMode,
    ZoomLevel,
} from "./types";

// ============================================
// STATUS CONFIGURATION
// ============================================

/** Cấu hình hiển thị trạng thái cuộc hẹn */
export const APPOINTMENT_STATUS_CONFIG: Record<
  AppointmentStatus,
  {
    label: string;
    color: string; // Tailwind class
    bgColor: string;
    icon: string; // Lucide icon name
  }
> = {
  pending: {
    label: "Chờ xác nhận",
    color: "text-amber-600",
    bgColor: "bg-amber-50 dark:bg-amber-950/30",
    icon: "Clock",
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    icon: "CheckCircle2",
  },
  in_progress: {
    label: "Đang thực hiện",
    color: "text-violet-600",
    bgColor: "bg-violet-50 dark:bg-violet-950/30",
    icon: "Play",
  },
  completed: {
    label: "Hoàn thành",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
    icon: "CheckCheck",
  },
  cancelled: {
    label: "Đã hủy",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
    icon: "XCircle",
  },
  no_show: {
    label: "Khách không đến",
    color: "text-gray-500",
    bgColor: "bg-gray-100 dark:bg-gray-800",
    icon: "UserX",
  },
};

/** Danh sách trạng thái để hiển thị trong filter */
export const APPOINTMENT_STATUS_OPTIONS: {
  value: AppointmentStatus;
  label: string;
}[] = [
  { value: "pending", label: "Chờ xác nhận" },
  { value: "confirmed", label: "Đã xác nhận" },
  { value: "in_progress", label: "Đang thực hiện" },
  { value: "completed", label: "Hoàn thành" },
  { value: "cancelled", label: "Đã hủy" },
  { value: "no_show", label: "Khách không đến" },
];

// ============================================
// CALENDAR VIEW CONFIGURATION
// ============================================

/** Cấu hình các chế độ xem lịch */
export const CALENDAR_VIEW_CONFIG: Record<
  CalendarViewType,
  {
    label: string;
    icon: string;
    description: string;
  }
> = {
  day: {
    label: "Ngày",
    icon: "CalendarDays",
    description: "Xem chi tiết theo ngày",
  },
  week: {
    label: "Tuần",
    icon: "Calendar",
    description: "Xem tổng quan tuần",
  },
  month: {
    label: "Tháng",
    icon: "CalendarRange",
    description: "Xem tổng quan tháng",
  },
  agenda: {
    label: "Danh sách",
    icon: "List",
    description: "Xem dạng danh sách",
  },
  timeline: {
    label: "Timeline",
    icon: "GanttChart",
    description: "Xem theo nhân viên/phòng",
  },
};

/** Các mức zoom cho Timeline */
export const ZOOM_LEVEL_OPTIONS: { value: ZoomLevel; label: string }[] = [
  { value: 15, label: "15 phút" },
  { value: 30, label: "30 phút" },
  { value: 60, label: "1 giờ" },
  { value: 240, label: "4 giờ" },
];

/** Các chế độ mật độ hiển thị */
export const DENSITY_MODE_OPTIONS: { value: DensityMode; label: string }[] = [
  { value: "comfortable", label: "Thoải mái" },
  { value: "compact", label: "Thu gọn" },
];

// ============================================
// TIME CONFIGURATION
// ============================================

/** Giờ làm việc mặc định của Spa */
export const DEFAULT_WORKING_HOURS = {
  startHour: 8,
  endHour: 21,
} as const;

/** Các khoảng thời gian slot (phút) */
export const TIME_SLOT_INTERVALS = [15, 30, 60] as const;

/** Interval mặc định cho time picker */
export const DEFAULT_TIME_INTERVAL = 15;

/** Chiều cao mỗi giờ trong grid (pixels) - cho density modes */
export const HOUR_HEIGHT = {
  comfortable: 60,
  compact: 40,
} as const;

/** Ngày trong tuần (bắt đầu từ Thứ 2) */
export const WEEKDAYS = [
  { value: 1, label: "T2", fullLabel: "Thứ Hai" },
  { value: 2, label: "T3", fullLabel: "Thứ Ba" },
  { value: 3, label: "T4", fullLabel: "Thứ Tư" },
  { value: 4, label: "T5", fullLabel: "Thứ Năm" },
  { value: 5, label: "T6", fullLabel: "Thứ Sáu" },
  { value: 6, label: "T7", fullLabel: "Thứ Bảy" },
  { value: 0, label: "CN", fullLabel: "Chủ Nhật" },
] as const;

// ============================================
// RECURRENCE CONFIGURATION
// ============================================

/** Các tần suất lặp lại */
export const RECURRENCE_FREQUENCY_OPTIONS = [
  { value: "daily", label: "Hàng ngày" },
  { value: "weekly", label: "Hàng tuần" },
  { value: "monthly", label: "Hàng tháng" },
  { value: "yearly", label: "Hàng năm" },
] as const;

/** Các loại kết thúc lịch lặp */
export const RECURRENCE_END_OPTIONS = [
  { value: "never", label: "Không bao giờ" },
  { value: "count", label: "Sau số lần" },
  { value: "until", label: "Đến ngày" },
] as const;

// ============================================
// UI CONFIGURATION
// ============================================

/** Số events tối đa hiển thị trong ô Month View */
export const MAX_EVENTS_IN_MONTH_CELL = 2;

/** Kích thước minimum của touch target (pixels) */
export const MIN_TOUCH_TARGET_SIZE = 44;

/** Thời gian delay cho tooltip (ms) */
export const TOOLTIP_DELAY = 300;

/** Animation durations */
export const ANIMATION_DURATION = {
  fast: 150,
  normal: 200,
  slow: 300,
} as const;

// ============================================
// SERVICE COLORS (Sample - sẽ lấy từ services)
// ============================================

/** Màu mặc định cho các dịch vụ (fallback) */
export const DEFAULT_SERVICE_COLORS = [
  "#4CAF50", // Green - Massage
  "#2196F3", // Blue - Facial
  "#9C27B0", // Purple - Body Treatment
  "#FF9800", // Orange - Nail
  "#E91E63", // Pink - Hair
  "#00BCD4", // Cyan - Spa Package
  "#795548", // Brown - Sauna
  "#607D8B", // Blue Grey - Others
] as const;

// ============================================
// EMPTY STATE MESSAGES
// ============================================

export const EMPTY_STATE_MESSAGES = {
  noAppointments: {
    title: "Chưa có lịch hẹn",
    description: "Hôm nay bạn rảnh rỗi! Tận hưởng nhé.",
  },
  noResults: {
    title: "Không tìm thấy kết quả",
    description: "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.",
  },
  error: {
    title: "Đã xảy ra lỗi",
    description: "Không thể tải dữ liệu. Vui lòng thử lại.",
  },
} as const;

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

export const KEYBOARD_SHORTCUTS = {
  createEvent: { key: "c", description: "Tạo lịch hẹn mới" },
  today: { key: "t", description: "Về hôm nay" },
  dayView: { key: "d", description: "Xem theo ngày" },
  weekView: { key: "w", description: "Xem theo tuần" },
  monthView: { key: "m", description: "Xem theo tháng" },
  agendaView: { key: "a", description: "Xem danh sách" },
  nextPeriod: { key: "ArrowRight", description: "Tiếp theo" },
  prevPeriod: { key: "ArrowLeft", description: "Trước đó" },
  closeSheet: { key: "Escape", description: "Đóng panel" },
} as const;
