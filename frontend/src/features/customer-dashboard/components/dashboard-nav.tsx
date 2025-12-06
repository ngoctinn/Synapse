"use client"

import { cn } from "@/shared/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { DASHBOARD_NAV_ITEMS } from "../constants"

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-24 space-y-2" aria-label="Menu điều hướng chính">
      <div className="px-4 py-2">
        <h2 className="text-lg font-bold text-primary tracking-tight">Menu</h2>
      </div>
      <div className="space-y-1">
        {DASHBOARD_NAV_ITEMS.map((item) => {
          const isActive = item.href === "/dashboard"
            ? pathname === item.href
            : pathname === item.href || pathname?.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ease-in-out relative overflow-hidden rounded-r-full mr-4",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
              )}
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                )}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
