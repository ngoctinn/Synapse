import { AppointmentList } from "@/features/customer-dashboard";
import { getCustomerAppointments } from "@/features/customer-dashboard/index.server";
import { Separator } from "@/shared/ui/separator";
import { Suspense } from "react";

export const metadata = {
  title: "Lịch hẹn của tôi | Synapse",
  description: "Quản lý và theo dõi các lịch hẹn chăm sóc sắc đẹp của bạn",
};

export default async function AppointmentsPage() {
  const appointments = await getCustomerAppointments();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h3 className="text-2xl font-bold tracking-tight">Lịch hẹn của tôi</h3>
        <p className="text-muted-foreground text-sm">
          Xem thông tin chi tiết và trạng thái các lịch hẹn đã đặt.
        </p>
      </div>
      <Separator />
      
      <Suspense fallback={<div className="flex h-40 items-center justify-center">Đang tải lịch hẹn...</div>}>
        <AppointmentList appointments={appointments} />
      </Suspense>
    </div>
  );
}