import { Role, ScheduleViewType } from "./types";

// ============================================================================
// ROLE CONFIG
// ============================================================================

export const ROLE_CONFIG: Record<
  Role,
  {
    label: string;
    variant:
      | "default"
      | "secondary"
      | "destructive"
      | "outline"
      | "success"
      | "warning"
      | "info"
      | "purple"
      | "sky"
      | "cyan"
      | "gray"
      | "glass";
    className?: string;
  }
> = {
  admin: {
    label: "Quản trị viên",
    variant: "purple",
  },
  receptionist: {
    label: "Lễ tân",
    variant: "sky",
  },
  technician: {
    label: "Kỹ thuật viên",
    variant: "cyan",
  },
  customer: {
    label: "Khách hàng",
    variant: "gray",
  },
};

export const MODULES = [
  { id: "dashboard", name: "Dashboard" },
  { id: "staff", name: "Quản lý Nhân viên" },
  { id: "customers", name: "Quản lý Khách hàng" },
  { id: "services", name: "Quản lý Dịch vụ" },
  { id: "inventory", name: "Kho & Sản phẩm" },
  { id: "reports", name: "Báo cáo & Thống kê" },
  { id: "settings", name: "Cấu hình Hệ thống" },
];

export const ROLES = [
  { id: "admin", name: "Quản trị viên", variant: "purple" },
  { id: "receptionist", name: "Lễ tân", variant: "sky" },
  { id: "technician", name: "Kỹ thuật viên", variant: "cyan" },
] as const;

export const STAFF_HEADER_OFFSET_CLASS = "top-[105px] md:top-[53px]";

// ============================================================================
// SCHEDULE VIEW CONFIG
// ============================================================================

export const SCHEDULE_VIEW_CONFIG: Record<
  ScheduleViewType,
  {
    label: string;
    description: string;
  }
> = {
  week: {
    label: "Tuần",
    description: "Xem lịch theo tuần",
  },
  month: {
    label: "Tháng",
    description: "Xem lịch theo tháng",
  },
};

// ============================================================================
// WEEKDAYS
// ============================================================================

export const WEEKDAYS = [
  { value: 1, label: "T2", fullLabel: "Thứ 2" },
  { value: 2, label: "T3", fullLabel: "Thứ 3" },
  { value: 3, label: "T4", fullLabel: "Thứ 4" },
  { value: 4, label: "T5", fullLabel: "Thứ 5" },
  { value: 5, label: "T6", fullLabel: "Thứ 6" },
  { value: 6, label: "T7", fullLabel: "Thứ 7" },
  { value: 0, label: "CN", fullLabel: "Chủ Nhật" },
] as const;

// ============================================================================
// SCHEDULER UI LABELS
// ============================================================================

export const SCHEDULER_UI = {
  // Navigation
  PREV: "Trước",
  NEXT: "Tiếp",
  TODAY: "Hôm nay",

  // Views
  WEEK_VIEW: "Tuần",
  MONTH_VIEW: "Tháng",

  // Actions
  ADD_SHIFT: "Thêm ca",
  MANAGE_SHIFTS: "Quản lý ca",
  PUBLISH: "Công bố",
  PUBLISH_ALL: "Công bố tất cả",

  // Selection
  SELECTED: "Đã chọn",
  APPLY: "Áp dụng",
  CLEAR_SELECTION: "Bỏ chọn",
  DELETE_ALL: "Xóa tất cả",

  // Status
  DRAFT: "Bản nháp",
  PUBLISHED: "Đã công bố",

  // Filters
  ALL_STAFF: "Tất cả nhân viên",
  ALL_ROLES: "Tất cả vai trò",
  FILTER_BY_STAFF: "Lọc theo nhân viên",
  FILTER_BY_ROLE: "Lọc theo vai trò",

  // Empty states
  NO_STAFF: "Chưa có nhân viên",
  NO_SCHEDULES: "Chưa có lịch phân công",
  ADD_STAFF_FIRST: "Thêm nhân viên để bắt đầu xếp lịch",

  // Tooltips
  CLICK_TO_ADD: "Nhấp để thêm ca",
  CLICK_TO_VIEW: "Nhấp để xem chi tiết",
  CLICK_TO_SELECT: "Nhấp để chọn",

  // Confirm
  CONFIRM_DELETE: "Xác nhận xóa",
  CONFIRM_DELETE_MSG: "Bạn có chắc muốn xóa ca này?",

  // Toast messages
  SUCCESS_ADD: "Đã thêm ca làm việc",
  SUCCESS_DELETE: "Đã xóa ca làm việc",
  SUCCESS_UPDATE: "Đã cập nhật lịch",
  SUCCESS_PUBLISH: "Đã công bố lịch",
} as const;

// ============================================================================
// SCHEDULE CONSTANTS
// ============================================================================

export const MAX_SHIFTS_PER_DAY = 3;
export const DEFAULT_WEEK_START = 1; // Monday
