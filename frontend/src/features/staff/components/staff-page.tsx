"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { PermissionMatrix } from "./permissions/permission-matrix"
import { StaffScheduler } from "./scheduling/staff-scheduler"
import { StaffModal } from "./staff-list/staff-modal"
import { StaffTable } from "./staff-list/staff-table"

export function StaffPage() {
  return (
    <Tabs defaultValue="list" className="h-full flex flex-col gap-3">
      <div className="flex items-center justify-between px-4 h-12 shrink-0 bg-white rounded-2xl shadow-sm">
        <TabsList className="h-9">
          <TabsTrigger value="list">Danh sách nhân viên</TabsTrigger>
          <TabsTrigger value="permissions">Phân quyền</TabsTrigger>
          <TabsTrigger value="scheduling">Lịch làm việc</TabsTrigger>
        </TabsList>
        <StaffModal />
      </div>

      <div className="flex-1 overflow-y-auto min-h-0">
        <TabsContent value="list" className="space-y-4 mt-0 p-1">
          <StaffTable />
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4 mt-0 p-1">
          <PermissionMatrix />
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4 mt-0 h-full p-1">
          <StaffScheduler />
        </TabsContent>
      </div>
    </Tabs>
  )
}
