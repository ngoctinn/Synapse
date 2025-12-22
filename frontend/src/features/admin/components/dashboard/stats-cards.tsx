"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import {
  Users,
  CalendarCheck,
  CreditCard,
  Clock,
  Hotel,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"

export function StatsCards() {
  const stats = [
    {
      title: "Lịch hẹn hôm nay",
      value: "24",
      description: "+2 so với hôm qua",
      icon: CalendarCheck,
      trend: "up",
      color: "text-blue-600",
      bg: "bg-blue-100/50"
    },
    {
      title: "Khách hàng mới",
      value: "12",
      description: "+15% tuân này",
      icon: Users,
      trend: "up",
      color: "text-purple-600",
      bg: "bg-purple-100/50"
    },
    {
      title: "Doanh thu ngày",
      value: "15.4M",
      description: "-5% so với mục tiêu",
      icon: CreditCard,
      trend: "down",
      color: "text-emerald-600",
      bg: "bg-emerald-100/50"
    },
    {
      title: "Giường trống",
      value: "4/15",
      description: "Đang được sử dụng 73%",
      icon: Hotel,
      trend: "neutral",
      color: "text-amber-600",
      bg: "bg-amber-100/50"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
              <stat.icon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="flex items-center text-xs text-muted-foreground mt-1">
              {stat.trend === "up" ? (
                <ArrowUpRight className="size-3 text-emerald-500 mr-1" />
              ) : stat.trend === "down" ? (
                <ArrowDownRight className="size-3 text-rose-500 mr-1" />
              ) : (
                <Clock className="size-3 text-amber-500 mr-1" />
              )}
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
