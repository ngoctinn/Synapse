"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import {
  Users,
  CalendarCheck,
  CreditCard,
  Clock,
  Hotel,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export function StatsCards() {
  const stats = [
    {
      title: "Lịch hẹn hôm nay",
      value: "24",
      description: "+2 so với hôm qua",
      icon: CalendarCheck,
      trend: "up",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Khách hàng mới",
      value: "12",
      description: "+15% tuần này",
      icon: Users,
      trend: "up",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Doanh thu ngày",
      value: "15.4M",
      description: "-5% so với mục tiêu",
      icon: CreditCard,
      trend: "down",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Giường trống",
      value: "4/15",
      description: "Đang được sử dụng 73%",
      icon: Hotel,
      trend: "neutral",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="group overflow-hidden border-none shadow-sm transition-all duration-300 hover:shadow-md"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div
              className={`rounded-lg p-2 ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}
            >
              <stat.icon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-muted-foreground mt-1 flex items-center text-xs">
              {stat.trend === "up" ? (
                <ArrowUpRight className="mr-1 size-3 text-emerald-500" />
              ) : stat.trend === "down" ? (
                <ArrowDownRight className="mr-1 size-3 text-rose-500" />
              ) : (
                <Clock className="mr-1 size-3 text-amber-500" />
              )}
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
