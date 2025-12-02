
import { getSkills } from "@/features/services/actions"
import { getStaffList } from "@/features/staff/actions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Suspense } from "react"
import { InviteStaffModal } from "./invite-staff-modal"
import { PermissionMatrix } from "./permissions/permission-matrix"
import { StaffScheduler } from "./scheduling/staff-scheduler"
import { StaffTable, StaffTableSkeleton } from "./staff-list/staff-table"

async function StaffListWrapper() {
  const [staffListResponse, skillsResponse] = await Promise.all([
    getStaffList(),
    getSkills()
  ])

  return (
    <StaffTable
      data={staffListResponse.data}
      skills={skillsResponse.data}
      page={1}
      totalPages={Math.ceil(staffListResponse.total / 10)}
    />
  )
}

async function StaffPageHeaderActions() {
  const skillsResponse = await getSkills()
  return <InviteStaffModal skills={skillsResponse.data} />
}

export function StaffPage() {
  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <div className="flex-1 bg-white overflow-hidden flex flex-col">
        <Tabs defaultValue="list" className="flex flex-col h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0 bg-white">
            <TabsList className="h-9 bg-muted/50 p-1">
              <TabsTrigger value="list" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-medium px-4">Danh sách</TabsTrigger>
              <TabsTrigger value="permissions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-medium px-4">Phân quyền</TabsTrigger>
              <TabsTrigger value="scheduling" className="data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs font-medium px-4">Lịch làm việc</TabsTrigger>
            </TabsList>
            <StaffPageHeaderActions />
          </div>

          <div className="flex-1 overflow-hidden relative">
            <TabsContent value="list" className="h-full mt-0 border-0 p-0 data-[state=inactive]:hidden">
              <Suspense fallback={<StaffTableSkeleton />}>
                <StaffListWrapper />
              </Suspense>
            </TabsContent>

            <TabsContent value="permissions" className="h-full mt-0 border-0 p-0 data-[state=inactive]:hidden">
              <PermissionMatrix />
            </TabsContent>

            <TabsContent value="scheduling" className="h-full mt-0 border-0 p-0 data-[state=inactive]:hidden">
              <StaffScheduler />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
