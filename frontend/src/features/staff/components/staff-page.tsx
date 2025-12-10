"use client"

import { Skill } from "@/features/services"
import { SearchInput } from "@/shared/ui/custom/search-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Suspense, use, useState } from "react"
import { InviteStaffTrigger } from "./invite-staff-trigger"
import { PermissionMatrix } from "./permissions/permission-matrix"
import { StaffScheduler } from "./scheduling/staff-scheduler"
import { StaffFilter } from "./staff-filter"
import { StaffTable, StaffTableSkeleton } from "./staff-list/staff-table"

import { Schedule } from "../types"

interface StaffPageProps {
  page: number
  skills: Skill[]
  staffListPromise: Promise<any>
  initialPermissions: Record<string, Record<string, boolean>>
  initialSchedules: Schedule[]
}

function StaffListWrapper({
  staffListPromise,
  skills,
  page,
}: {
  staffListPromise: Promise<any>
  skills: Skill[]
  page: number
}) {
  const { data, total } = use(staffListPromise)
  const totalPages = Math.ceil(total / 10)

  return (
    <StaffTable
      data={data}
      skills={skills}
      page={page}
      totalPages={totalPages}
      variant="flush"
      className="border-t"
    />
  )
}


function StaffSchedulerWrapper({
  staffListPromise,
  initialSchedules,
}: {
  staffListPromise: Promise<any>
  initialSchedules: Schedule[]
}) {
  const { data } = use(staffListPromise)
  return <StaffScheduler initialSchedules={initialSchedules} staffList={data} className="border-t" />
}

const Footer = () => (
  <div className="text-center text-sm text-muted-foreground py-6 mt-auto">
    © 2025 Synapse. All rights reserved.
  </div>
)

export function StaffPage({ page, skills, staffListPromise, initialPermissions, initialSchedules }: StaffPageProps) {
  const [activeTab, setActiveTab] = useState("list")

  return (
    <div
      className="min-h-screen flex flex-col w-full"
      style={
        {
          "--staff-header-height": "53px",
          "--staff-header-height-mobile": "105px",
        } as React.CSSProperties
      }
    >
      <Tabs defaultValue="list" className="flex flex-col flex-1 w-full gap-0" onValueChange={setActiveTab}>

        <div
          className="sticky top-0 z-40 px-4 py-2 bg-background border-b flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <TabsList className="h-9 bg-muted/50 p-1 w-full md:w-auto justify-start">
            <TabsTrigger value="list" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Danh sách</TabsTrigger>
            <TabsTrigger value="permissions" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Phân quyền</TabsTrigger>
            <TabsTrigger value="scheduling" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Lịch làm việc</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {activeTab === "list" && (
              <div className="flex items-center gap-2 flex-1 md:flex-none">
                <SearchInput
                  placeholder="Tìm kiếm nhân viên..."
                  className="w-full md:w-[250px] h-9"
                />
                <StaffFilter />
              </div>
            )}
            <InviteStaffTrigger skills={skills} />
            {/* Additional toolbars for other tabs can be added here if needed */}
          </div>
        </div>

        <div className="flex-1 p-0 motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-4 duration-300 ease-out flex flex-col">
          <TabsContent value="list" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <Suspense fallback={<StaffTableSkeleton />}>
              <StaffListWrapper
                staffListPromise={staffListPromise}
                skills={skills}
                page={page}
              />
            </Suspense>
            <Footer />
          </TabsContent>

          <TabsContent value="permissions" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <Suspense fallback={<div className="p-8 space-y-4">
              <div className="h-8 w-1/3 bg-muted animate-pulse rounded" />
              <div className="h-64 w-full bg-muted animate-pulse rounded-lg" />
            </div>}>
              <PermissionMatrix initialPermissions={initialPermissions} className="border-t" />
            </Suspense>
            <Footer />
          </TabsContent>

          <TabsContent value="scheduling" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <Suspense fallback={<div className="flex-1 flex flex-col p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-10 w-48 bg-muted animate-pulse rounded" />
                <div className="flex gap-2">
                   <div className="h-9 w-24 bg-muted animate-pulse rounded" />
                   <div className="h-9 w-24 bg-muted animate-pulse rounded" />
                </div>
              </div>
              <div className="flex-1 w-full bg-muted/20 animate-pulse rounded-lg border border-dashed border-muted" />
            </div>}>
              <StaffSchedulerWrapper
                staffListPromise={staffListPromise}
                initialSchedules={initialSchedules}
              />
            </Suspense>
            <Footer />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
