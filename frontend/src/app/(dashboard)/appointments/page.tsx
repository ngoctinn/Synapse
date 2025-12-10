import { Separator } from "@/shared/ui/separator"

export default function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Lịch hẹn của tôi</h3>
        <p className="text-sm text-muted-foreground">
          Quản lý và theo dõi các lịch hẹn sắp tới và lịch sử đặt lịch.
        </p>
      </div>
      <Separator />
      <div className="flex items-center justify-center min-h-[40vh] border rounded-lg border-dashed">
         <p className="text-muted-foreground">Tính năng đang được cập nhật.</p>
      </div>
    </div>
  )
}
