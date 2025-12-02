import { InviteStaffModal, StaffTable, StaffTableSkeleton } from "@/features/staff"
import { getSkills, getStaffList } from "@/features/staff/actions"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Quản lý nhân sự | Synapse",
  description: "Quản lý nhân viên",
}

import { Skill } from "@/features/services/types"

async function StaffListWrapper({
  staffListPromise,
  skills,
}: {
  staffListPromise: Promise<any>
  skills: Skill[]
}) {
  const { data, total } = await staffListPromise
  const totalPages = Math.ceil(total / 10) // Default limit is 10

  return (
    <StaffTable
      data={data}
      skills={skills}
      page={1}
      totalPages={totalPages}
    />
  )
}

export default async function Page() {
  const skillsPromise = getSkills()
  const staffListPromise = getStaffList()

  const skills = await skillsPromise

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
        <h1 className="text-lg font-semibold">Danh sách nhân viên</h1>
        <InviteStaffModal skills={skills} />
      </div>
      <div className="flex-1 overflow-hidden p-0">
        <Suspense fallback={<StaffTableSkeleton />}>
          <StaffListWrapper
            staffListPromise={staffListPromise}
            skills={skills}
          />
        </Suspense>
      </div>
    </div>
  )
}
