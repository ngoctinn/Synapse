import { StatsCards } from "@/features/admin/components/dashboard/stats-cards";
import { RecentAppointments } from "@/features/admin/components/dashboard/recent-appointments";
import { OperationalStatus } from "@/features/admin/components/dashboard/operational-status";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Xin chào, Lễ tân 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Hôm nay là một ngày bận rộn. Đây là những gì đang diễn ra.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl shadow-sm">
            Báo cáo nhanh
          </Button>
          <Button asChild className="rounded-xl shadow-md">
            <Link href="/booking">
              <Plus className="mr-2 size-4" />
              Tạo lịch hẹn mới
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Section */}
      <StatsCards />

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <RecentAppointments />
        <OperationalStatus />
      </div>
    </div>
  );
}
