import { Role } from "./types";

export const ROLE_CONFIG: Record<Role, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "processing" | "success" | "warning" | "info" | "purple" | "indigo" | "glass" | "glass-light"; className?: string }> = {
  admin: {
    label: "Quản trị viên",
    variant: "purple",
  },
  receptionist: {
    label: "Lễ tân",
    variant: "info",
  },
  technician: {
    label: "Kỹ thuật viên",
    variant: "warning",
  },
  customer: {
    label: "Khách hàng",
    variant: "secondary",
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
  { id: "receptionist", name: "Lễ tân", variant: "info" },
  { id: "technician", name: "Kỹ thuật viên", variant: "warning" },
] as const
