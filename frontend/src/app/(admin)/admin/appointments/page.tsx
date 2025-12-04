import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quản lý lịch hẹn | Synapse",
  description: "Quản lý danh sách lịch hẹn",
}

export default function AppointmentsPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Quản lý lịch hẹn</h2>
        <p className="text-muted-foreground mt-2">Tính năng đang được xây dựng lại.</p>
      </div>
    </div>
  )
}
