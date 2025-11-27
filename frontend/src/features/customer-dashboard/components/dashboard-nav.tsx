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
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Menu</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <Button
              key={item.href}
              variant={isActive ? "default" : "ghost"}
              className={cn("w-full justify-start", isActive && "bg-primary text-primary-foreground")}
              asChild
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}
