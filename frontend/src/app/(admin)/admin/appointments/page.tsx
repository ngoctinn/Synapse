import {
  AppointmentCalendar,
  AppointmentDialog,
  AppointmentLayout,
  AppointmentSidebar,
  AppointmentTable,
  AppointmentViewToggle,
  AppointmentViewTransition,
  getAppointments
} from "@/features/appointments"
import { MOCK_SERVICES } from "@/features/services/data/mock-services"
import { MOCK_STAFF } from "@/features/staff/data/mock-staff"
import { Button } from "@/shared/ui/button"
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"
import { SearchInput } from "@/shared/ui/custom/search-input"
import { Plus } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Quản lý lịch hẹn | Synapse",
  description: "Quản lý danh sách lịch hẹn",
}

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    view?: string;
    status?: string;
    staff_id?: string;
    service_id?: string;
    date_from?: string;
    date_to?: string;
    q?: string; // Search query
  }>
}) {
  const {
    page: pageParam,
    view: viewParam,
    status,
    staff_id,
    service_id,
    date_from,
    date_to,
    q
  } = await searchParams

  const page = Number(pageParam) || 1
  const view = viewParam === "calendar" ? "calendar" : "list"

  // Tải dữ liệu song song (Parallel Fetching)
  const [
    { data: appointments, total },
  ] = await Promise.all([
    getAppointments({
      page,
      status,
      staff_id,
      date_from,
      date_to,
      q
    }),
  ])

  // Sử dụng Mock Data cho Staff và Services
  const staffList = MOCK_STAFF
  const serviceList = MOCK_SERVICES

  return (
    <AppointmentLayout
      sidebar={
        <AppointmentSidebar
          staffList={staffList}
          serviceList={serviceList}
        />
      }
    >
      <div className="flex flex-col h-full">
        {/* Thanh công cụ phía trên (Toolbar) */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white shrink-0 relative z-10">
          <div className="flex items-center gap-4 flex-1">
            <SearchInput placeholder="Tìm kiếm lịch hẹn..." className="max-w-xs" />
            <div className="h-6 w-px bg-slate-200 mx-2" />
            <Suspense>
              <AppointmentViewToggle />
            </Suspense>
          </div>
          <Button asChild>
            <Link href="?action=create">
              <Plus className="mr-2 h-4 w-4" />
              Tạo lịch hẹn
            </Link>
          </Button>
        </div>

        {/* Khu vực nội dung chính */}
        <div className="flex-1 overflow-hidden p-6 bg-slate-50/50">
          <Suspense fallback={<DataTableSkeleton columnCount={6} />}>
            <AppointmentViewTransition view={view}>
              {view === "list" ? (
                <AppointmentTable
                  appointments={appointments}
                  page={page}
                  totalPages={Math.ceil(total / 10)}
                />
              ) : (
                <AppointmentCalendar
                  appointments={appointments}
                  staffList={staffList}
                />
              )}
            </AppointmentViewTransition>
          </Suspense>
        </div>
      </div>
      <AppointmentDialog />
    </AppointmentLayout>
  )
}
