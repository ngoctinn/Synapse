import { getCustomerAppointments, getCustomerProfile, getCustomerTreatments } from "@/features/customer-dashboard/services/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { Calendar, Sparkles, User } from "lucide-react"

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
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Lịch hẹn sắp tới
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              buổi hẹn đang chờ bạn
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Liệu trình đang dùng
            </CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTreatments}</div>
            <p className="text-xs text-muted-foreground">
              gói dịch vụ đang kích hoạt
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Điểm tích lũy
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.loyaltyPoints}</div>
            <p className="text-xs text-muted-foreground">
              điểm thưởng ({profile.membershipTier})
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
    </div>
  )
}
