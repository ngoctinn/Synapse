"use client"

import { cn } from "@/shared/lib/utils"
import {
    Bell,
    Briefcase,
    Calendar,
    CreditCard,
    LayoutDashboard,
    LogOut,
    MessageSquare,
    Palette
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

// Danh sách các mục trong Sidebar
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

export function AdminSidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside className={cn(
      "flex flex-col h-full w-40 transition-all duration-300",
      "bg-white/80 backdrop-blur-md border border-white/20 shadow-xl", // Glassmorphism
      className
    )}>
      {/* Logo Section */}
      <div className="h-14 flex items-center px-4 border-b border-slate-200/50">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
          Synapse
        </h1>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative group block"
            >
              <div className={cn(
                "relative z-10 flex items-center gap-2 px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200",
                isActive ? "text-primary-foreground" : "text-slate-600 group-hover:text-slate-900 group-hover:bg-slate-100/50"
              )}>
                {/* Active Background Animation */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bg"
                    className="absolute inset-0 bg-primary rounded-md -z-10 shadow-md shadow-primary/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <Icon className={cn("w-5 h-5 transition-colors", isActive ? "text-primary-foreground" : "text-slate-500 group-hover:text-slate-700")} />
                {item.title}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer / Logout Section */}
      <div className="p-3 border-t border-slate-200/50">
        <button className="flex items-center gap-2 px-2 py-2 w-full text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors group">
          <LogOut className="w-5 h-5 group-hover:text-red-700 transition-transform group-hover:-translate-x-1" />
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
