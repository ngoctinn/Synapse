import { AppointmentList } from "@/features/customer-dashboard/components/appointment-list"
import { getCustomerAppointments } from "@/features/customer-dashboard/services/api"
import { Separator } from "@/shared/ui/separator"

export default async function AppointmentsPage() {
  const appointments = await getCustomerAppointments()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Lịch hẹn của tôi</h3>
        <p className="text-sm text-muted-foreground">
          Quản lý và theo dõi các lịch hẹn sắp tới và lịch sử đặt lịch.
        </p>
      </div>
      <Separator />
      <AppointmentList appointments={appointments} />
    </div>
  )
}
