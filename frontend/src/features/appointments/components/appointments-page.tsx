"use client"

import { Separator } from "@/shared/ui/separator"

export function AppointmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Quản lý Lịch hẹn</h3>
          <p className="text-sm text-muted-foreground">
            Xem và quản lý tất cả các lịch hẹn của spa.
          </p>
        </div>
      </div>
      <Separator />
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">Chưa có nội dung</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Tính năng đang được phát triển lại.
          </p>
        </div>
      </div>
    </div>
  )
}
