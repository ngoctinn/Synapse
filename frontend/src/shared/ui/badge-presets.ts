import { type VariantProps } from "class-variance-authority";
import { badgeVariants } from "./badge";

// ============================================
// PRESET SYSTEM - Domain Specific Configurations
// ============================================

export type BadgePreset =
  // Appointment Status
  | "appointment-pending"
  | "appointment-confirmed"
  | "appointment-in-progress"
  | "appointment-completed"
  | "appointment-cancelled"
  | "appointment-no-show"
  // Staff Roles
  | "role-admin"
  | "role-receptionist"
  | "role-technician"
  | "role-customer"
  // Customer Tiers
  | "tier-silver"
  | "tier-gold"
  | "tier-platinum"
  // Resource Status
  | "resource-available"
  | "resource-in-use"
  | "resource-maintenance"
  // Resource Types
  | "resource-bed"
  | "resource-equipment"
  // Invoice Status
  | "invoice-unpaid"
  | "invoice-paid"
  | "invoice-refunded"
  // Exception Types
  | "exception-holiday"
  | "exception-maintenance"
  | "exception-special"
  | "exception-custom"
  // Channel Status
  | "channel-connected"
  | "channel-disconnected"
  // Generic
  | "tag"
  | "count"
  | "new"
  | "skill"
  // Statuses
  | "status-active"
  | "status-inactive";

export type PresetConfig = {
  variant: NonNullable<VariantProps<typeof badgeVariants>["variant"]>;
  size?: VariantProps<typeof badgeVariants>["size"];
  label?: string;
  withIndicator?: boolean;
  indicatorPulse?: boolean;
};

export const BADGE_PRESETS: Record<BadgePreset, PresetConfig> = {
  // === APPOINTMENT STATUS ===
  "appointment-pending": { variant: "warning", label: "Chờ xác nhận" },
  "appointment-confirmed": { variant: "info", label: "Đã xác nhận" },
  "appointment-in-progress": {
    variant: "secondary",
    label: "Đang thực hiện",
    withIndicator: true,
    indicatorPulse: true,
  },
  "appointment-completed": { variant: "success", label: "Hoàn thành" },
  "appointment-cancelled": { variant: "destructive", label: "Đã hủy" },
  "appointment-no-show": { variant: "outline", label: "Không đến" },

  // === ROLES ===
  "role-admin": { variant: "secondary", label: "Quản trị viên" },
  "role-receptionist": { variant: "info", label: "Lễ tân" },
  "role-technician": { variant: "info", label: "Kỹ thuật viên" },
  "role-customer": { variant: "outline", label: "Khách hàng" },

  // === TIERS ===
  "tier-silver": { variant: "outline", label: "Silver" },
  "tier-gold": { variant: "warning", label: "Gold" },
  "tier-platinum": { variant: "secondary", label: "Platinum" },

  // === RESOURCE STATUS ===
  "resource-available": {
    variant: "success",
    label: "Sẵn sàng",
    withIndicator: true,
  },
  "resource-in-use": { variant: "warning", label: "Đang sử dụng" },
  "resource-maintenance": { variant: "destructive", label: "Bảo trì" },

  // === RESOURCE TYPE ===
  "resource-bed": { variant: "info", size: "sm", label: "Giường" },
  "resource-equipment": { variant: "secondary", size: "sm", label: "Thiết bị" },

  // === INVOICE ===
  "invoice-unpaid": { variant: "warning", label: "Chưa thanh toán" },
  "invoice-paid": { variant: "success", label: "Đã thanh toán" },
  "invoice-refunded": { variant: "destructive", label: "Đã hoàn tiền" },

  // === EXCEPTION TYPES ===
  "exception-holiday": { variant: "destructive", size: "xs", label: "Nghỉ lễ" },
  "exception-maintenance": { variant: "outline", size: "xs", label: "Bảo trì" },
  "exception-special": {
    variant: "secondary",
    size: "xs",
    label: "Giờ đặc biệt",
  },
  "exception-custom": { variant: "outline", size: "xs", label: "Tùy chỉnh" },

  // === CHANNEL STATUS ===
  "channel-connected": { variant: "success", label: "Đã kết nối" },
  "channel-disconnected": { variant: "outline", label: "Chưa kết nối" },

  // === GENERIC ===
  tag: { variant: "info", size: "sm" },
  count: { variant: "secondary", size: "xs" },
  new: { variant: "success", label: "Mới", size: "sm" },
  skill: { variant: "violet", size: "sm" },
  // Statuses
  "status-active": { variant: "status-active", label: "Hoạt động" },
  "status-inactive": { variant: "status-inactive", label: "Ngưng" },
};
