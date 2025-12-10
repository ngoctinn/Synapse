
import { AppointmentPage } from "@/features/appointments"
import { getAppointments, getCustomers, getResources } from "@/features/appointments/actions"
import { getServices } from "@/features/services/actions"

export default async function Page() {
  const [appointments, resources, customers, servicesRes] = await Promise.all([
    getAppointments(),
    getResources(),
    getCustomers(),
    getServices(1, 100)
  ])

  return (
    <AppointmentPage
      initialAppointments={appointments}
      initialResources={resources}
      initialCustomers={customers}
      initialServices={servicesRes.data}
    />
  )
}
