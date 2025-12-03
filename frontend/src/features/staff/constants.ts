import { Role } from "./types";

export const ROLE_CONFIG: Record<Role, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; className?: string }> = {
  admin: {
    label: "Quản trị viên",
    variant: "outline",
    className: "bg-purple-500/10 text-purple-700 border-purple-200 hover:bg-purple-500/20"
  },
  receptionist: {
    label: "Lễ tân",
    variant: "outline",
    className: "bg-blue-500/10 text-blue-700 border-blue-200 hover:bg-blue-500/20"
  },
  technician: {
    label: "Kỹ thuật viên",
    variant: "outline",
    className: "bg-orange-500/10 text-orange-700 border-orange-200 hover:bg-orange-500/20"
  },
  customer: {
    label: "Khách hàng",
    variant: "outline",
    className: "bg-gray-500/10 text-gray-700 border-gray-200"
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
  { id: "admin", name: "Quản trị viên", variant: "outline", className: "bg-purple-500/10 text-purple-700 border-purple-200" },
  { id: "receptionist", name: "Lễ tân", variant: "outline", className: "bg-blue-500/10 text-blue-700 border-blue-200" },
  { id: "technician", name: "Kỹ thuật viên", variant: "outline", className: "bg-orange-500/10 text-orange-700 border-orange-200" },
] as const
