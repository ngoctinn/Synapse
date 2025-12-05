import { DashboardStats, getCustomerAppointments, getCustomerProfile, getCustomerTreatments } from "@/features/customer-dashboard"

export default async function DashboardPage() {
  const [appointments, treatments, profile] = await Promise.all([
    getCustomerAppointments(),
    getCustomerTreatments(),
    getCustomerProfile(),
  ])

  const upcomingAppointments = appointments.filter(a => a.status === 'CONFIRMED' || a.status === 'PENDING').length
  const activeTreatments = treatments.filter(t => t.status === 'ACTIVE').length

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <DashboardStats
        upcomingAppointments={upcomingAppointments}
        activeTreatments={activeTreatments}
        loyaltyPoints={profile.loyaltyPoints ?? 0}
        membershipTier={profile.membershipTier ?? 'SILVER'}
      />
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  )
}
