import { StaffScheduler } from "@/features/staff"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lịch làm việc | Synapse",
  description: "Quản lý lịch làm việc của nhân viên",
}

export default function StaffSchedulePage() {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
        <h1 className="text-lg font-semibold">Lịch làm việc</h1>
      </div>
      <div className="flex-1 overflow-hidden p-0">
        <StaffScheduler />
      </div>
    </div>
  )
}
