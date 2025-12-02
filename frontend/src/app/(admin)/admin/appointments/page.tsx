import { AppointmentTable } from "@/features/appointments"
import { Metadata } from "next"
import { Suspense } from "react"
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"

export const metadata: Metadata = {
  title: "Quản lý lịch hẹn | Synapse",
  description: "Quản lý danh sách lịch hẹn",
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) || 1

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
        <h1 className="text-lg font-semibold">Danh sách lịch hẹn</h1>
        {/* Add Create Appointment Button here later */}
      </div>
      <div className="flex-1 overflow-hidden p-0">
        <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
          <AppointmentTable page={page} />
        </Suspense>
      </div>
    </div>
  )
}
