"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/shared/ui/alert-dialog"
import { Button } from "@/shared/ui/button"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Appointment, Customer, Resource } from "@/features/appointments/types"
import { Service } from "@/features/services/types"
import { Plus } from "lucide-react"
import { AppointmentFilter } from "./appointment-filter"
import { AppointmentSheet } from "./appointment-sheet"
import { AppointmentTable } from "./appointment-table"
import { AppointmentTimeline } from "./appointment-timeline"

interface AppointmentPageProps {
    initialAppointments: Appointment[];
    initialResources: Resource[];
    initialServices: Service[];
    initialCustomers: Customer[];
}

const Footer = () => (
  <div className="text-center text-sm text-muted-foreground py-6 mt-auto">
    © 2025 Synapse. All rights reserved.
  </div>
)

export function AppointmentPage({
    initialAppointments,
    initialResources,
    initialServices,
    initialCustomers
}: AppointmentPageProps) {


  const [activeTab, setActiveTab] = useState("timeline")

  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)


  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [sheetMode, setSheetMode] = useState<"create" | "update">("create")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)


  const [createDefaultDate, setCreateDefaultDate] = useState<Date | undefined>(undefined)
  const [createDefaultResource, setCreateDefaultResource] = useState<string | undefined>(undefined)


  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false)
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null)


  /*
    SYNC STATE: Sync local state with server props when they change.
    This supports Server-Side Filtering (URL changes -> new props -> new state).
  */
  useEffect(() => {
    setAppointments(initialAppointments)
  }, [initialAppointments])

  // Removed client-side filtering (filteredAppointments) to rely on Backend processing.
  // The 'appointments' state now holds the data to display, either from Server (init) or Client (optimistic).



  const handleSlotClick = (resourceId: string, time: Date) => {
      setSheetMode("create")
      setCreateDefaultResource(resourceId)
      setCreateDefaultDate(time)
      setSelectedAppointment(null)
      setIsSheetOpen(true)
  }

  const handleAppointmentClick = (appointment: Appointment) => {
      setSheetMode("update")
      setSelectedAppointment(appointment)
      setIsSheetOpen(true)
  }

  const handleCreateButtonClick = () => {
      setSheetMode("create")
      setCreateDefaultDate(undefined)
      setCreateDefaultResource(undefined)
      setSelectedAppointment(null)
      setIsSheetOpen(true)
  }

  const handleSheetSubmit = (data: any) => {

      if (sheetMode === "create") {
          setAppointments(prev => [...prev, data as Appointment])
      } else {
          setAppointments(prev => prev.map(a => a.id === data.id ? { ...a, ...data } : a))
      }

  }

  const handleEditAppointment = (appointment: Appointment) => {
     handleAppointmentClick(appointment)
  }

  const handleCreateCancelRequest = (appointment: Appointment) => {
      setAppointmentToCancel(appointment)
      setIsCancelAlertOpen(true)
  }

  const handleConfirmCancel = () => {
      if (!appointmentToCancel) return

      setAppointments(prev => prev.map(a =>
          a.id === appointmentToCancel.id ? { ...a, status: 'cancelled' } : a
      ))

      toast.success("Đã hủy lịch hẹn thành công")

      setIsCancelAlertOpen(false)

      if (selectedAppointment?.id === appointmentToCancel.id) {
          setIsSheetOpen(false)
      }
      setAppointmentToCancel(null)
  }

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Tabs defaultValue="timeline" className="flex flex-col flex-1 w-full gap-0" onValueChange={setActiveTab}>

        <AppointmentFilter
          viewMode={activeTab as "list" | "timeline" | "calendar"}
          startContent={
            <TabsList className="h-9 bg-muted/50 p-1 w-full md:w-auto justify-start">
              <TabsTrigger value="timeline" className="px-4 w-28 flex-1 md:flex-none">Lịch biểu</TabsTrigger>
              <TabsTrigger value="list" className="px-4 w-28 flex-1 md:flex-none">Danh sách</TabsTrigger>
            </TabsList>
          }
          endContent={
            <div className="hidden md:block">
                 <Button
                    onClick={handleCreateButtonClick}
                    size="sm"
                    className="gap-2"
                 >
                     <Plus className="h-4 w-4" />
                     Tạo lịch hẹn
                 </Button>
            </div>
          }
        />

        <div className="flex-1 p-0 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out flex flex-col">
          <TabsContent value="timeline" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">


             <AppointmentTimeline
               appointments={appointments}
               resources={initialResources}
               onSlotClick={handleSlotClick}
               onAppointmentClick={handleAppointmentClick}
             />
             <Footer />
          </TabsContent>

          <TabsContent value="list" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
             <div className="flex-1 p-4 md:p-6 overflow-hidden">
                <AppointmentTable
                  appointments={appointments}
                  resources={initialResources}
                  onEdit={handleEditAppointment}
                  onCancel={handleCreateCancelRequest}
                />
             </div>
             <Footer />
          </TabsContent>
        </div>
      </Tabs>

      <AppointmentSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        mode={sheetMode}
        appointment={selectedAppointment}
        defaultDate={createDefaultDate}
        defaultResourceId={createDefaultResource}
        onSubmit={handleSheetSubmit}
        services={initialServices}
        customers={initialCustomers}
        resources={initialResources}
        existingAppointments={appointments}
      />

      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hủy lịch hẹn?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy lịch hẹn của khách hàng {appointmentToCancel?.customerName}?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Quay lại</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xác nhận hủy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
