"use client"

import { SearchInput } from "@/shared/ui/custom/search-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { useState } from "react"
import { MOCK_APPOINTMENTS, MOCK_RESOURCES } from "../mock-data"
import { AppointmentFilter } from "./appointment-filter"
import { AppointmentTimeline } from "./appointment-timeline"
import { CreateAppointmentDialog } from "./create-appointment-dialog"

interface AppointmentPageProps {
    initialData?: boolean; // Reserved for future server data
}

const Footer = () => (
  <div className="text-center text-sm text-muted-foreground py-6 mt-auto">
    © 2025 Synapse. All rights reserved.
  </div>
)

export function AppointmentPage({ initialData = true }: AppointmentPageProps) {
  const [activeTab, setActiveTab] = useState("timeline")
  const isTimelineTab = activeTab === "timeline"

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Tabs defaultValue="timeline" className="flex flex-col flex-1 w-full gap-0" onValueChange={setActiveTab}>
        {/* Sticky Header with Tabs and Actions */}
        <div
          className="sticky top-0 z-50 px-4 py-2 bg-background border-b flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <TabsList className="h-9 bg-muted/50 p-1 w-full md:w-auto justify-start">
            <TabsTrigger value="timeline" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Lịch biểu</TabsTrigger>
            <TabsTrigger value="list" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Danh sách</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-none">
              <SearchInput
                placeholder="Tìm kiếm lịch hẹn..."
                className="w-full md:w-[250px] h-9"
              />
              <AppointmentFilter />
            </div>
            <CreateAppointmentDialog />
          </div>
        </div>

        <div className="flex-1 p-0 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out flex flex-col">
          <TabsContent value="timeline" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">

             {/* The Timeline Component */}
             <AppointmentTimeline
               appointments={MOCK_APPOINTMENTS}
               resources={MOCK_RESOURCES}
             />
             <Footer />
          </TabsContent>

          <TabsContent value="list" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <div className="flex flex-1 items-center justify-center text-muted-foreground p-8">
              Chế độ xem danh sách đang được phát triển...
            </div>
            <Footer />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
