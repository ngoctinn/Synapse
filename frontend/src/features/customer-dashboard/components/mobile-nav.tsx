"use client"

import { cn } from "@/shared/lib/utils"
import { Calendar, Home, Sparkles, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tổng quan", icon: Home },
  { href: "/appointments", label: "Lịch hẹn", icon: Calendar },
  { href: "/treatments", label: "Liệu trình", icon: Sparkles },
  { href: "/profile", label: "Hồ sơ", icon: User },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Glassmorphism Container */}
      <div className="bg-background/80 backdrop-blur-lg border-t shadow-lg pb-[env(safe-area-inset-bottom)]">
        <div className="grid h-16 grid-cols-4">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/dashboard"
              ? pathname === item.href
              : pathname?.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 transition-all duration-300",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-primary/80"
                )}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                )}
                <item.icon
                  className={cn(
                    "h-6 w-6 transition-all duration-300",
                    isActive ? "scale-110 -translate-y-1 fill-current/20" : "scale-100"
                  )}
                />
                <span className={cn("text-[10px] font-medium transition-all duration-300", isActive ? "font-bold" : "")}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
