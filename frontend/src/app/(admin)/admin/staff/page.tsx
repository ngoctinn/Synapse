import { InviteStaffModal, StaffTable, StaffTableSkeleton } from "@/features/staff"
import { getStaffList } from "@/features/staff/actions"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Quản lý nhân sự | Synapse",
  description: "Quản lý nhân viên",
}

async function StaffListWrapper() {
  const staffList = await getStaffList()
  return (
    <StaffTable
      data={staffList}
      page={1}
      totalPages={10}
    />
  )
}

export default function Page() {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
        <h1 className="text-lg font-semibold">Danh sách nhân viên</h1>
        <InviteStaffModal />
      </div>
      <div className="flex-1 overflow-hidden p-0">
        <Suspense fallback={<StaffTableSkeleton />}>
          <StaffListWrapper />
        </Suspense>
      </div>
    </div>
  )
}
