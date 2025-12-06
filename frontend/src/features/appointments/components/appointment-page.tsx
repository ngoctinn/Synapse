"use client"

import { SearchInput } from "@/shared/ui/custom/search-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { useState } from "react"
import { MOCK_APPOINTMENTS, MOCK_RESOURCES } from "../mock-data"
import { Appointment } from "../types"
import { AppointmentDetailDialog } from "./appointment-detail-dialog"
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
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)

  // Dialog States
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createDefaultDate, setCreateDefaultDate] = useState<Date | undefined>(undefined)
  const [createDefaultResource, setCreateDefaultResource] = useState<string | undefined>(undefined)

  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  // Handlers
  const handleSlotClick = (resourceId: string, time: Date) => {
      setCreateDefaultResource(resourceId)
      setCreateDefaultDate(time)
      setIsCreateOpen(true)
  }

  const handleAppointmentClick = (appointment: Appointment) => {
      setSelectedAppointment(appointment)
      setIsDetailOpen(true)
  }

  const handleCreateAppointment = (newAppointment: Appointment) => {
      setAppointments(prev => [...prev, newAppointment])
  }

  const handleEditAppointment = (appointment: Appointment) => {
     alert(`Chức năng chỉnh sửa đang phát triển cho: ${appointment.customerName}`)
     // TODO: Implement Edit Logic
  }

  const handleCancelAppointment = (appointment: Appointment) => {
      if (confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) {
        setAppointments(prev => prev.map(a =>
            a.id === appointment.id ? { ...a, status: 'cancelled' } : a
        ));
        setIsDetailOpen(false);
      }
  }

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
            <CreateAppointmentDialog
                open={isCreateOpen}
                onOpenChange={setIsCreateOpen}
                defaultDate={createDefaultDate}
                defaultResourceId={createDefaultResource}
                onSubmit={handleCreateAppointment}
            />
          </div>
        </div>

        <div className="flex-1 p-0 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out flex flex-col">
          <TabsContent value="timeline" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">

             {/* The Timeline Component */}
             <AppointmentTimeline
               appointments={appointments}
               resources={MOCK_RESOURCES}
               onSlotClick={handleSlotClick}
               onAppointmentClick={handleAppointmentClick}
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

      <AppointmentDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        appointment={selectedAppointment}
        resource={MOCK_RESOURCES.find(r => r.id === selectedAppointment?.resourceId) ?? null}
        onEdit={handleEditAppointment}
        onCancel={handleCancelAppointment}
      />
    </div>
  )
}
