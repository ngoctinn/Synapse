"use client"

import { cn } from "@/shared/lib/utils"
import {
  Bell,
  Calendar,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Palette,
  Settings,
  Users,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const sidebarItems = [
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
    title: "Tài khoản",
    href: "/admin/accounts",
    icon: Users,
  },
  {
    title: "Lịch làm",
    href: "/admin/schedules",
    icon: Settings,
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

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside className={cn("flex flex-col h-full bg-white border-r border-border w-40 transition-all duration-300", className)}>
      <div className="h-14 flex items-center px-4 border-b border-border">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          Synapse
        </h1>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 group",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary-foreground" : "text-slate-500 group-hover:text-slate-700")} />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button className="flex items-center gap-2 px-2 py-2 w-full text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors group">
          <LogOut className="w-5 h-5 group-hover:text-red-700" />
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
