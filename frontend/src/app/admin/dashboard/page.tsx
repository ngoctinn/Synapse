import { StatsCards } from "@/features/admin/components/dashboard/stats-cards";
import { RecentAppointments } from "@/features/admin/components/dashboard/recent-appointments";
import { OperationalStatus } from "@/features/admin/components/dashboard/operational-status";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-5">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center px-0 py-2">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Xin chào, Lễ tân 👋
          </h1>
          <p className="text-muted-foreground mt-1 capitalize">
            Hôm nay là {new Intl.DateTimeFormat("vi-VN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric"
            }).format(new Date())}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-lg shadow-sm">
            Báo cáo nhanh
          </Button>
          <Button asChild className="rounded-lg shadow-md">
            <Link href="/booking">
              <Plus className="size-4" />
              Tạo lịch hẹn mới
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-0 pb-8">

      {/* KPI Section */}
      <StatsCards />

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        <RecentAppointments />
        <OperationalStatus />
      </div>
      </div>
    </div>
  );
}
