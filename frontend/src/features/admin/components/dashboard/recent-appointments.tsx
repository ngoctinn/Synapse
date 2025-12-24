"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { MoreHorizontal, Scissors, Clock } from "lucide-react";
import Link from "next/link";

export function RecentAppointments() {
  const appointments = [
    {
      id: "1",
      customer: "Lê Thị Thu",
      service: "Massage Thụy Điển",
      time: "14:30",
      status: "checked-in",
      staff: "Nguyễn An",
      staffAvatar: "",
    },
    {
      id: "2",
      customer: "Trần Minh Tâm",
      service: "Chăm sóc da mặt chuyên sâu",
      time: "15:00",
      status: "pending",
      staff: "Lê Bình",
      staffAvatar: "",
    },
    {
      id: "3",
      customer: "Phạm Hồng Nhung",
      service: "Gội đầu dưỡng sinh",
      time: "15:15",
      status: "pending",
      staff: "Trương Cường",
      staffAvatar: "",
    },
    {
      id: "4",
      customer: "Ngô Quốc Bảo",
      service: "Trị liệu vai gáy",
      time: "16:00",
      status: "pending",
      staff: "Đặng Dũng",
      staffAvatar: "",
    },
  ];

  const statusMap = {
    pending: { label: "Sắp tới", variant: "secondary" as const },
    "checked-in": { label: "Đã đến", variant: "default" as const },
    completed: { label: "Hoàn thành", variant: "success" as const },
    cancelled: { label: "Đã hủy", variant: "destructive" as const },
  };

  return (
    <Card className="col-span-3 border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg font-bold">Lịch hẹn sắp tới</CardTitle>
          <p className="text-muted-foreground text-sm">
            Theo dõi các ca làm việc tiếp theo
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/appointments">Xem tất cả</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="group flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="bg-muted text-muted-foreground flex w-14 shrink-0 flex-col items-center justify-center rounded-lg py-2.5">
                  <span className="text-xs font-bold leading-none">
                    {apt.time}
                  </span>
                  <Clock className="mt-1 size-3 opacity-60" />
                </div>
                <div>
                  <div className="group-hover:text-primary cursor-pointer text-sm font-bold transition-colors">
                    {apt.customer}
                  </div>
                  <div className="text-muted-foreground mt-0.5 flex items-center gap-1 text-xs">
                    <Scissors className="size-3 opacity-60" />
                    {apt.service}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="hidden flex-col items-end md:flex">
                  <div className="text-sm font-medium leading-none">
                    {apt.staff}
                  </div>
                  <div className="text-muted-foreground mt-1 text-xs opacity-80">
                    Chuyên viên
                  </div>
                </div>
                <Badge
                  variant={
                    statusMap[apt.status as keyof typeof statusMap].variant
                  }
                  className="px-3 py-0.5 font-medium"
                >
                  {statusMap[apt.status as keyof typeof statusMap].label}
                </Badge>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
