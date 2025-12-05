import { Skill } from "@/features/services"
import { SearchInput } from "@/shared/ui/custom/search-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Suspense } from "react"
import { InviteStaffModal } from "./invite-staff-modal"
import { PermissionMatrix } from "./permissions/permission-matrix"
import { StaffScheduler } from "./scheduling/staff-scheduler"
import { StaffFilter } from "./staff-filter"
import { StaffTable, StaffTableSkeleton } from "./staff-list/staff-table"

interface StaffPageProps {
  page: number
  skills: Skill[]
  staffListPromise: Promise<any>
  initialPermissions: Record<string, Record<string, boolean>>
  initialSchedules: any[] // Replace with Schedule type
}

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
  const totalPages = Math.ceil(total / 10)

  return (
    <StaffTable
      data={data}
      skills={skills}
      page={page}
      totalPages={totalPages}
      className="-mx-4 border-x-0 border-t-0 rounded-none shadow-none"
    />
  )
}


async function StaffSchedulerWrapper({
  staffListPromise,
  initialSchedules,
}: {
  staffListPromise: Promise<any>
  initialSchedules: any[]
}) {
  const { data } = await staffListPromise
  return <StaffScheduler initialSchedules={initialSchedules} staffList={data} />
}

export function StaffPage({ page, skills, staffListPromise, initialPermissions, initialSchedules }: StaffPageProps) {
  return (
    <div className="min-h-screen flex flex-col pb-10">
      <Tabs defaultValue="list" className="flex flex-col h-full">
        {/* Sticky Header with Tabs and Actions */}
        <div className="sticky top-0 z-40 -mx-4 px-4 py-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
          <TabsList className="h-9 bg-muted/50 p-1 w-full md:w-auto justify-start">
            <TabsTrigger value="list" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs font-medium px-4 transition-all duration-200 flex-1 md:flex-none">Danh sách</TabsTrigger>
            <TabsTrigger value="permissions" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs font-medium px-4 transition-all duration-200 flex-1 md:flex-none">Phân quyền</TabsTrigger>
            <TabsTrigger value="scheduling" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-xs font-medium px-4 transition-all duration-200 flex-1 md:flex-none">Lịch làm việc</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-none">
              <SearchInput placeholder="Tìm kiếm nhân viên..." className="w-full md:w-[250px] h-9" />
              <StaffFilter />
            </div>
            <InviteStaffModal skills={skills} />
          </div>
        </div>

        <div className="flex-1 p-0 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out">
          <TabsContent value="list" className="h-full mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <Suspense fallback={<StaffTableSkeleton />}>
              <StaffListWrapper
                staffListPromise={staffListPromise}
                skills={skills}
                page={page}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="permissions" className="h-full mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <PermissionMatrix initialPermissions={initialPermissions} />
          </TabsContent>

          <TabsContent value="scheduling" className="h-full mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <Suspense fallback={<div className="p-4 text-center text-muted-foreground">Đang tải lịch làm việc...</div>}>
              <StaffSchedulerWrapper
                staffListPromise={staffListPromise}
                initialSchedules={initialSchedules}
              />
            </Suspense>
          </TabsContent>
        </div>
      </Tabs>

      {/* Short Footer */}
      <div className="text-center text-sm text-muted-foreground py-2 mt-auto">
        © 2025 Synapse. All rights reserved.
      </div>
    </div>
  )
}
