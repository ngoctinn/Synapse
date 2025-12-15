import {
  Box,
  Calendar,
  CreditCard,
  Home,
  Scissors,
  Settings,
  Star,
  User,
  Users,
} from "lucide-react";

export type SidebarItem = {
  title: string;
  href: string;
  icon: React.ElementType;
  items?: {
    title: string;
    href: string;
  }[];
};

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Tổng quan",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Lịch hẹn",
    href: "/admin/appointments",
    icon: Calendar,
  },
  {
    title: "Khách hàng",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Nhân sự",
    href: "/admin/staff",
    icon: User,
  },
  {
    title: "Dịch vụ",
    href: "/admin/services",
    icon: Scissors,
  },
  {
    title: "Tài nguyên",
    href: "/admin/resources",
    icon: Box,
  },
  {
    title: "Hóa đơn",
    href: "/admin/billing",
    icon: CreditCard,
  },
  {
    title: "Đánh giá",
    href: "/admin/reviews",
    icon: Star,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
  },
];
