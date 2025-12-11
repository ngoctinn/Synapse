"use client"

import { Separator } from "@/shared/ui/separator"

export function AppointmentsPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="surface-card p-6 min-h-[500px] flex flex-col">
        <div className="flex items-center justify-between mb-6">
            <div>
            <h3 className="text-lg font-medium">Quản lý Lịch hẹn</h3>
            <p className="text-sm text-muted-foreground">
                Xem và quản lý tất cả các lịch hẹn của spa.
            </p>
            </div>
        </div>
        <Separator className="mb-6" />
        <div className="flex flex-1 shrink-0 items-center justify-center rounded-md border border-dashed bg-muted/20">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
            <h3 className="mt-4 text-lg font-semibold">Chưa có nội dung</h3>
            <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Tính năng đang được phát triển lại.
            </p>
            </div>
        </div>
      </div>
    </div>
  )
}
