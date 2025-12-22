"use client"

import { cn } from "@/shared/lib/utils"
import {
  Home,
  Calendar,
  ClipboardList,
  User,
  PlusCircle
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { icon: Home, label: "Công việc", href: "/admin/workspace" },
  { icon: Calendar, label: "Lịch hẹn", href: "/admin/appointments" },
  { icon: PlusCircle, label: "Tạo mới", href: "/booking", primary: true },
  { icon: ClipboardList, label: "Liệu trình", href: "/admin/treatments" },
  { icon: User, label: "Cá nhân", href: "/admin/settings" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t pb-safe">
      <nav className="flex items-center justify-around h-16 px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          if (item.primary) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center justify-center -mt-8"
              >
                <div className="size-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-lg border-4 border-background">
                  <Icon className="size-6" />
                </div>
                <span className="text-[10px] font-medium mt-1">{item.label}</span>
              </Link>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 transition-colors py-1",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("size-6", isActive && "fill-primary/10")} />
              <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
