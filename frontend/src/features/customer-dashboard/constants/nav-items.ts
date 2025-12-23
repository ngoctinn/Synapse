import { Calendar, Home, LucideIcon, Sparkles, User } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/**
 * Danh sách các mục điều hướng trong Customer Dashboard.
 * Sử dụng chung cho cả desktop sidebar và mobile bottom navigation.
 */
export const DASHBOARD_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Tổng quan", icon: Home },
  { href: "/dashboard/appointments", label: "Lịch hẹn", icon: Calendar },
  { href: "/dashboard/treatments", label: "Liệu trình", icon: Sparkles },
  { href: "/dashboard/profile", label: "Hồ sơ", icon: User },
];
