export type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled"

export interface Appointment {
  id: string
  customerName: string
  serviceName: string
  startTime: Date
  endTime: Date
  status: AppointmentStatus
  staffName: string
  staffId: string
  customerId: string
  notes?: string
}
