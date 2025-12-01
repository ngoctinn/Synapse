import {
    Bell,
    Briefcase,
    Calendar,
    CreditCard,
    LayoutDashboard,
    MessageSquare,
    Palette
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
    icon: LayoutDashboard,
  },
  {
    title: "Lịch hẹn",
    href: "/admin/appointments",
    icon: Calendar,
  },
  {
    title: "Nhân sự",
    href: "/admin/staff",
    icon: Briefcase,
    items: [
      {
        title: "Danh sách",
        href: "/admin/staff",
      },
      {
        title: "Phân quyền",
        href: "/admin/staff/permissions",
      },
      {
        title: "Lịch làm việc",
        href: "/admin/staff/schedule",
      },
    ],
  },
  {
    title: "Dịch vụ",
    href: "/admin/services",
    icon: CreditCard,
  },
  {
    title: "Tin nhắn",
    href: "/admin/messages",
    icon: MessageSquare,
  },
  {
    title: "Thông báo",
    href: "/admin/notifications",
    icon: Bell,
  },
  {
    title: "Thành phần giao diện",
    href: "/admin/components",
    icon: Palette,
  },
]
