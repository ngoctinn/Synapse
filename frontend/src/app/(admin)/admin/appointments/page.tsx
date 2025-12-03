import { AppointmentFilter, AppointmentTable } from "@/features/appointments"
import { SearchInput } from "@/shared/ui/custom/search-input"
import { Metadata } from "next"
import { Suspense } from "react"
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"
import { getStaffList } from "@/features/staff"

async function AppointmentFilterWrapper() {
  const { data: staffList } = await getStaffList(1, 100) // Fetch all staff for filter
  return <AppointmentFilter staffList={staffList} />
}

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
        <div className="flex items-center gap-2 flex-1">
          <SearchInput placeholder="Tìm kiếm lịch hẹn..." />
          <Suspense>
            <AppointmentFilterWrapper />
          </Suspense>
        </div>
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
