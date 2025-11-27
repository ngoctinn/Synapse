"use client"

import { cn } from "@/shared/lib/utils"
import { Button } from "@/shared/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Calendar, Home, Sparkles, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_ITEMS = [
  { href: "/dashboard", label: "Tổng quan", icon: Home },
  { href: "/dashboard/appointments", label: "Lịch hẹn", icon: Calendar },
  { href: "/dashboard/treatments", label: "Liệu trình", icon: Sparkles },
  { href: "/dashboard/profile", label: "Hồ sơ", icon: User },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <Card className="h-fit sticky top-24 transition-all duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-primary">Menu</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "w-full justify-start text-sm font-normal transition-colors h-auto py-2.5",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon className={cn("mr-2 h-4 w-4", isActive ? "text-primary" : "text-foreground")} />
                {item.label}
              </Link>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
