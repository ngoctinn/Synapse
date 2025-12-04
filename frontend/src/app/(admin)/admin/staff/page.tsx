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
      className="-mx-4 border-x-0 rounded-none shadow-none"
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
    <div className="min-h-screen flex flex-col pb-10">
      {/* Sticky Header with enhanced Glassmorphism */}
      <div className="sticky top-0 z-50 -mx-4 -mt-4 px-4 py-4 bg-background border-b flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
        <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Quản lý nhân sự
            </h1>
            <p className="text-sm text-muted-foreground">
                Quản lý danh sách nhân viên, vai trò và phân quyền.
            </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 flex-1 md:flex-none">
            <SearchInput placeholder="Tìm kiếm nhân viên..." className="w-full md:w-[250px]" />
            <StaffFilter />
          </div>
          <InviteStaffModal skills={skills} />
        </div>
      </div>

      <div className="flex-1 p-0 mt-2 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out">
        <Suspense fallback={<StaffTableSkeleton />}>
          <StaffListWrapper
            staffListPromise={staffListPromise}
            skills={skills}
            page={page}
          />
        </Suspense>
      </div>
      {/* Short Footer */}
      <div className="text-center text-sm text-muted-foreground py-2">
        © 2025 Synapse. All rights reserved.
      </div>
    </div>
  )
}
