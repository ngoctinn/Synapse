import {
    Bell,
    Briefcase,
    Calendar,
    CreditCard,
    LayoutDashboard,
    MessageSquare,
    Palette
} from "lucide-react"

export const SIDEBAR_ITEMS = [
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
    title: "Components",
    href: "/admin/components",
    icon: Palette,
  },
]
