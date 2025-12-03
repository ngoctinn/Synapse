import { 
  AppointmentTable, 
  AppointmentCalendar, 
  AppointmentViewToggle,
  AppointmentDialog,
  AppointmentViewTransition,
  AppointmentSidebar,
  AppointmentLayout,
  getAppointments
} from "@/features/appointments"
import { SearchInput } from "@/shared/ui/custom/search-input"
import { Metadata } from "next"
import { Suspense } from "react"
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"
import { getStaffList } from "@/features/staff"
import { getServices } from "@/features/services"
import { Button } from "@/shared/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

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
    { data: staffList },
    { data: serviceList }
  ] = await Promise.all([
    getAppointments({
      page,
      status,
      staff_id,
      date_from,
      date_to,
      q
    }),
    getStaffList(1, 100), // Lấy danh sách nhân viên để lọc
    getServices(1, 100, undefined, true) // Lấy danh sách dịch vụ đang hoạt động để lọc
  ])

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
        <div className="flex items-center justify-between px-6 py-4 border-b bg-white shrink-0">
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
