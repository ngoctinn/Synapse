"use server"

import { addDays, setHours, setMinutes } from "date-fns"
import { Appointment } from "./types"

// Tạo dữ liệu giả để mô phỏng database
// Trong thực tế, dữ liệu này sẽ được truy vấn từ Database
const generateMockAppointments = (): Appointment[] => {
  const today = new Date()
  return [
    {
      id: "1",
      customerName: "Nguyễn Văn A",
      serviceName: "Cắt tóc nam",
      startTime: setMinutes(setHours(today, 9), 0),
      endTime: setMinutes(setHours(today, 9), 45),
      status: "confirmed",
      staffName: "Trần Văn B",
      staffId: "1",
      customerId: "1",
    },
    {
      id: "2",
      customerName: "Lê Thị C",
      serviceName: "Gội đầu dưỡng sinh",
      startTime: setMinutes(setHours(today, 10), 0),
      endTime: setMinutes(setHours(today, 11), 0),
      status: "pending",
      staffName: "Nguyễn Thị D",
      staffId: "2",
      customerId: "2",
    },
    {
      id: "3",
      customerName: "Phạm Văn E",
      serviceName: "Massage body",
      startTime: setMinutes(setHours(addDays(today, 1), 14), 0),
      endTime: setMinutes(setHours(addDays(today, 1), 15), 30),
      status: "confirmed",
      staffName: "Trần Văn B",
      staffId: "1",
      customerId: "3",
    },
    {
      id: "4",
      customerName: "Hoàng Thị F",
      serviceName: "Lấy ráy tai",
      startTime: setMinutes(setHours(today, 15), 0),
      endTime: setMinutes(setHours(today, 15), 30),
      status: "completed",
      staffName: "Nguyễn Thị D",
      staffId: "2",
      customerId: "4",
    },
  ]
}

export interface GetAppointmentsParams {
  page?: number
  limit?: number
  status?: string
  staff_id?: string
  date_from?: string
  date_to?: string
  q?: string
}

export async function getAppointments(params: GetAppointmentsParams) {
  // Giả lập độ trễ mạng để kiểm tra loading state
  await new Promise((resolve) => setTimeout(resolve, 500))

  let appointments = generateMockAppointments()

  // Logic lọc dữ liệu
  
  // 1. Lọc theo trạng thái
  if (params.status) {
    appointments = appointments.filter((apt) => apt.status === params.status)
  }

  // 2. Lọc theo nhân viên
  if (params.staff_id) {
    appointments = appointments.filter((apt) => apt.staffId === params.staff_id)
  }

  // 3. Lọc theo ngày bắt đầu (>= date_from)
  if (params.date_from) {
    const from = new Date(params.date_from)
    appointments = appointments.filter((apt) => apt.startTime >= from)
  }

  // 4. Lọc theo ngày kết thúc (<= date_to)
  if (params.date_to) {
    const to = new Date(params.date_to)
    // Đặt thời gian là cuối ngày (23:59:59) để bao gồm tất cả lịch hẹn trong ngày đó
    to.setHours(23, 59, 59, 999)
    appointments = appointments.filter((apt) => apt.startTime <= to)
  }

  // 5. Tìm kiếm theo từ khóa (Tên khách hàng, dịch vụ, nhân viên)
  if (params.q) {
    const query = params.q.toLowerCase()
    appointments = appointments.filter(
      (apt) =>
        apt.customerName.toLowerCase().includes(query) ||
        apt.serviceName.toLowerCase().includes(query) ||
        apt.staffName.toLowerCase().includes(query)
    )
  }

  return {
    data: appointments,
    total: appointments.length, // Mock total
    page: params.page || 1,
    limit: params.limit || 10,
  }
}
