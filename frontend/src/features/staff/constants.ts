import { Role } from "./types";

export const ROLE_CONFIG: Record<Role, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  ADMIN: { label: "Quản trị viên", variant: "destructive" },
  RECEPTIONIST: { label: "Lễ tân", variant: "default" },
  TECHNICIAN: { label: "Kỹ thuật viên", variant: "secondary" },
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
  { id: "ADMIN", name: "Quản trị viên", variant: "destructive" },
  { id: "RECEPTIONIST", name: "Lễ tân", variant: "default" },
  { id: "TECHNICIAN", name: "Kỹ thuật viên", variant: "secondary" },
] as const
