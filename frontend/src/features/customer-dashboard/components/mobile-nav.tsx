"use client"

import { cn } from "@/shared/lib/utils"
import { Calendar, Home, Sparkles, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tổng quan", icon: Home },
  { href: "/dashboard/appointments", label: "Lịch hẹn", icon: Calendar },
  { href: "/dashboard/treatments", label: "Liệu trình", icon: Sparkles },
  { href: "/dashboard/profile", label: "Hồ sơ", icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
      <div className="grid h-16 grid-cols-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors hover:text-primary",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive && "fill-current")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)] bg-background" />
    </div>
  )
}
