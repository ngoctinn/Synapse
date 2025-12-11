import {
  Bell,
  Box,
  Calendar,
  Home,
  Layers,
  Mail,
  Scissors,
  Settings,
  User,
  Users
} from "lucide-react"

export type SidebarItem = {
  title: string
  href: string
  icon: React.ElementType
  items?: {
    title: string
    href: string
  }[]
}

export const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    title: "Tổng quan",
    href: "/admin/overview",
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
    title: "Tin nhắn",
    href: "/admin/messages",
    icon: Mail,
  },
  {
    title: "Thông báo",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Thành phần",
    href: "/admin/components",
    icon: Layers,
  },
  {
    title: "Cài đặt",
    href: "/admin/settings",
    icon: Settings,
    items: [
      {
        title: "Thời gian hoạt động",
        href: "/admin/settings/operating-hours",
      },
      {
        title: "Thông báo",
        href: "/admin/settings/notifications",
      },
    ],
  },
]
