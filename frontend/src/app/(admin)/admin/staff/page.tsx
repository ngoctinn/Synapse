import { getSkills, getStaffList, InviteStaffModal, StaffFilter, StaffTable, StaffTableSkeleton } from "@/features/staff"
import { SearchInput } from "@/shared/ui/custom/search-input"

import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Quản lý nhân sự | Synapse",
  description: "Quản lý nhân viên",
}

import { Skill } from "@/features/services"

async function StaffListWrapper({
  staffListPromise,
  skills,
  page,
}: {
  staffListPromise: Promise<any>
  skills: Skill[]
  page: number
}) {
  const { data, total } = await staffListPromise
  const totalPages = Math.ceil(total / 10) // Default limit is 10

  return (
    <StaffTable
      data={data}
      skills={skills}
      page={page}
      totalPages={totalPages}
    />
  )
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams?.page) || 1
  const skillsPromise = getSkills()
  const staffListPromise = getStaffList(page)

  const skills = await skillsPromise

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
        <div className="flex items-center gap-2 flex-1">
          <SearchInput placeholder="Tìm kiếm nhân viên..." />
          <StaffFilter />
        </div>
        <InviteStaffModal skills={skills} />
      </div>
      <div className="flex-1 overflow-hidden p-0">
        <Suspense fallback={<StaffTableSkeleton />}>
          <StaffListWrapper
            staffListPromise={staffListPromise}
            skills={skills}
            page={page}
          />
        </Suspense>
      </div>
    </div>
  )
}
