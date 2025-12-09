"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Suspense, use, useState } from "react"
import { MaintenanceTask, Resource } from "../model/types"
import { MaintenanceTimeline } from "./maintenance-timeline"
import { ResourceFilter } from "./resource-filter"
import { ResourceTable, ResourceTableSkeleton } from "./resource-table"
import { ResourceToolbar } from "./resource-toolbar"

interface ResourcePageProps {
  resourcesPromise: Promise<Resource[]>
  tasksPromise: Promise<MaintenanceTask[]>
}

function ResourceListWrapper({
  resourcesPromise,
}: {
  resourcesPromise: Promise<Resource[]>
}) {
  const resources = use(resourcesPromise)
  return (
    <ResourceTable
      data={resources}
      variant="flush"
      className="border-t"
    />
  )
}

function MaintenanceTimelineWrapper({
  resourcesPromise,
  tasksPromise,
}: {
  resourcesPromise: Promise<Resource[]>
  tasksPromise: Promise<MaintenanceTask[]>
}) {
  const resources = use(resourcesPromise)
  const tasks = use(tasksPromise)
  return <MaintenanceTimeline resources={resources} tasks={tasks} />
}

const Footer = () => (
  <div className="text-center text-sm text-muted-foreground py-6 mt-auto">
    © 2025 Synapse. All rights reserved.
  </div>
)

export function ResourcePage({ resourcesPromise, tasksPromise }: ResourcePageProps) {
  const [activeTab, setActiveTab] = useState("list")

  return (
    <div className="min-h-screen flex flex-col w-full" style={{
      "--header-height": "53px",
      "--header-height-mobile": "105px"
    } as React.CSSProperties}>
      <Tabs defaultValue="list" className="flex flex-col flex-1 w-full gap-0" onValueChange={setActiveTab}>

        <div
          className="sticky top-0 z-40 px-4 py-2 bg-background border-b flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <TabsList className="h-9 bg-muted/50 p-1 w-full md:w-auto justify-start">
            <TabsTrigger value="list" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Danh sách</TabsTrigger>
            <TabsTrigger value="maintenance" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Lịch bảo trì</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {activeTab === "list" && (
              <div className="flex items-center gap-2 flex-1 md:flex-none">
                <ResourceToolbar />
                <ResourceFilter />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 p-0 motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-4 motion-safe:duration-300 ease-out flex flex-col">
          <TabsContent value="list" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <Suspense fallback={<ResourceTableSkeleton />}>
              <ResourceListWrapper resourcesPromise={resourcesPromise} />
            </Suspense>
            <Footer />
          </TabsContent>

          <TabsContent value="maintenance" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <Suspense fallback={<div className="p-4 text-center text-muted-foreground">Đang tải lịch bảo trì...</div>}>
              <MaintenanceTimelineWrapper
                resourcesPromise={resourcesPromise}
                tasksPromise={tasksPromise}
              />
            </Suspense>
            <Footer />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
