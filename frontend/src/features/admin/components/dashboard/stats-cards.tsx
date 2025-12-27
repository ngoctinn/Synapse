import { StatCard } from "@/shared/ui/data-display/stat-card";
import { Grid } from "@/shared/ui/layout/grid";
import {
    ArrowDownRight,
    ArrowUpRight,
    CalendarCheck,
    Clock,
    CreditCard,
    Hotel,
    Users,
} from "lucide-react";

export function StatsCards() {
  const stats = [
    {
      title: "Lịch hẹn hôm nay",
      value: "24",
      description: "+2 so với hôm qua",
      icon: CalendarCheck,
      trend: "up" as const,
      variant: "info" as const,
    },
    {
      title: "Khách hàng mới",
      value: "12",
      description: "+15% tuần này",
      icon: Users,
      trend: "up" as const,
      variant: "purple" as const,
    },
    {
      title: "Doanh thu ngày",
      value: "15.4M",
      description: "-5% so với mục tiêu",
      icon: CreditCard,
      trend: "down" as const,
      variant: "success" as const, // Original was emerald/success
    },
    {
      title: "Giường trống",
      value: "4/15",
      description: "Đang được sử dụng 73%",
      icon: Hotel,
      trend: "neutral" as const,
      variant: "warning" as const,
    },
  ];

  return (
    <Grid cols={1} className="md:grid-cols-2 lg:grid-cols-4" gap={3}>
      {stats.map((stat) => (
        <StatCard
          key={stat.title}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          variant={stat.variant}
          trend={stat.trend}
          description={
            <>
              {stat.trend === "up" ? (
                <ArrowUpRight className="size-3 text-emerald-500" />
              ) : stat.trend === "down" ? (
                <ArrowDownRight className="size-3 text-rose-500" />
              ) : (
                <Clock className="size-3 text-amber-500" />
              )}
              <span>{stat.description}</span>
            </>
          }
        />
      ))}
    </Grid>
  );
}
