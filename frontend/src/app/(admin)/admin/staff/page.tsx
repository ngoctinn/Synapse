import { InviteStaffModal, StaffTable, StaffTableSkeleton } from "@/features/staff"
import { getStaffList } from "@/features/staff/actions"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Quản lý nhân sự | Synapse",
  description: "Quản lý nhân viên",
}

async function StaffListWrapper({ page }: { page: number }) {
  const { data, total } = await getStaffList(page, 5)
  const totalPages = Math.ceil(total / 5)

  return (
    <StaffTable
      data={data}
      page={page}
      totalPages={totalPages}
    />
  )
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam) || 1

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
        <h1 className="text-lg font-semibold">Danh sách nhân viên</h1>
        <InviteStaffModal />
      </div>
      <div className="flex-1 overflow-hidden p-0">
        <Suspense fallback={<StaffTableSkeleton />}>
          <StaffListWrapper page={page} />
        </Suspense>
      </div>
    </div>
  )
}
