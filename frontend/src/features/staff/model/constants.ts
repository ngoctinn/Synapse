import { Role } from "./types";

export const ROLE_CONFIG: Record<Role, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info" | "purple" | "sky" | "cyan" | "gray" | "glass"; className?: string }> = {
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
  }
}

export const MODULES = [
  { id: "dashboard", name: "Dashboard" },
  { id: "staff", name: "Quản lý Nhân viên" },
  { id: "customers", name: "Quản lý Khách hàng" },
  { id: "services", name: "Quản lý Dịch vụ" },
  { id: "inventory", name: "Kho & Sản phẩm" },
  { id: "reports", name: "Báo cáo & Thống kê" },
  { id: "settings", name: "Cấu hình Hệ thống" },
]

export const ROLES = [
  { id: "admin", name: "Quản trị viên", variant: "purple" },
  { id: "receptionist", name: "Lễ tân", variant: "sky" },
  { id: "technician", name: "Kỹ thuật viên", variant: "cyan" },
] as const

export const STAFF_HEADER_OFFSET_CLASS = "top-[105px] md:top-[53px]"


export const SCHEDULER_UI = {
  PREV_WEEK: "Tuần trước",
  NEXT_WEEK: "Tuần sau",
  TODAY: "Hôm nay",
  UNSAVED_CHANGES: "Có thay đổi chưa lưu",
  CANCEL: "Hủy",
  SAVE: "Lưu thay đổi",
  SAVING: "Đang lưu...",
  PAINT_MODE: "Chế độ tô",
  ERASING: "Đang xóa",
  ERASER_TOOL: "Xóa lịch",
  TURN_OFF_PAINT: "Tắt chế độ tô",
  SELECT_TOOL_LABEL: "Chọn công cụ để tô",
  ERASER: "Tẩy",
  DRAG_TIP: "Nhấp hoặc kéo thả để áp dụng",
  DONE: "Xong",
  COPY_WEEK: "Sao chép tuần",
} as const;
