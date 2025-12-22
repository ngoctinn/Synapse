import {
  Box,
  Calendar,
  CalendarClock,
  ClipboardList,
  CreditCard,
  Home,
  FileText,
  Package,
  Scissors,
  Settings,
  ShieldCheck,
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
    title: "Danh sách chờ",
    href: "/admin/waitlist",
    icon: CalendarClock,
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
    title: "Hoa hồng",
    href: "/admin/staff/commission",
    icon: CreditCard,
  },
  {
    title: "Dịch vụ",
    href: "/admin/services",
    icon: Scissors,
  },
  {
    title: "Liệu trình",
    href: "/admin/treatments",
    icon: ClipboardList,
  },
  {
    title: "Bảo hành",
    href: "/admin/warranty",
    icon: ShieldCheck,
  },
  {
    title: "Nhật ký",
    href: "/admin/audit-logs",
    icon: FileText,
  },
  {
    title: "Gói dịch vụ",
    href: "/admin/packages",
    icon: Package,
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
