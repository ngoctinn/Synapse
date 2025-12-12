/**
 * Mock Data - Module Quản lý Lịch hẹn
 *
 * Dữ liệu giả lập cho development khi Backend chưa sẵn sàng.
 * Bao gồm: Appointments, Staff, Services, Resources, Customers
 */

import {
    addDays,
    addHours,
    setHours,
    setMinutes,
    startOfWeek,
    subDays,
} from "date-fns";
import type {
    Appointment,
    AppointmentMetrics,
    CalendarEvent,
    TimelineResource,
} from "./types";

// ============================================
// MOCK STAFF (Kỹ thuật viên)
// ============================================

export const MOCK_STAFF: TimelineResource[] = [
  {
    id: "staff-1",
    type: "staff",
    name: "Nguyễn Thị Thảo",
    avatar: "/avatars/thao.jpg",
    color: "#4CAF50",
    isActive: true,
    skills: ["massage", "facial", "body-treatment"],
  },
  {
    id: "staff-2",
    type: "staff",
    name: "Trần Linh Chi",
    avatar: "/avatars/chi.jpg",
    color: "#2196F3",
    isActive: true,
    skills: ["facial", "nail", "waxing"],
  },
  {
    id: "staff-3",
    type: "staff",
    name: "Lê Minh Hương",
    avatar: "/avatars/huong.jpg",
    color: "#9C27B0",
    isActive: true,
    skills: ["massage", "body-treatment", "sauna"],
  },
  {
    id: "staff-4",
    type: "staff",
    name: "Phạm Thanh Tâm",
    avatar: "/avatars/tam.jpg",
    color: "#FF9800",
    isActive: true,
    skills: ["nail", "hair", "makeup"],
  },
  {
    id: "staff-5",
    type: "staff",
    name: "Võ Hồng Nhung",
    avatar: "/avatars/nhung.jpg",
    color: "#E91E63",
    isActive: false, // Đang nghỉ
    skills: ["massage", "facial"],
  },
];

// ============================================
// MOCK RESOURCES (Phòng/Giường)
// ============================================

export const MOCK_RESOURCES: TimelineResource[] = [
  {
    id: "room-vip-1",
    type: "room",
    name: "Phòng VIP 1",
    color: "#FFD700",
    isActive: true,
  },
  {
    id: "room-vip-2",
    type: "room",
    name: "Phòng VIP 2",
    color: "#FFD700",
    isActive: true,
  },
  {
    id: "room-std-1",
    type: "room",
    name: "Phòng Thường 1",
    color: "#C0C0C0",
    isActive: true,
  },
  {
    id: "room-std-2",
    type: "room",
    name: "Phòng Thường 2",
    color: "#C0C0C0",
    isActive: true,
  },
  {
    id: "room-sauna",
    type: "room",
    name: "Phòng Xông hơi",
    color: "#8B4513",
    isActive: true,
  },
];

// ============================================
// MOCK SERVICES (Dịch vụ)
// ============================================

export interface MockService {
  id: string;
  name: string;
  duration: number; // phút
  price: number;
  color: string;
  category: string;
}

export const MOCK_SERVICES: MockService[] = [
  {
    id: "svc-massage-60",
    name: "Massage toàn thân 60'",
    duration: 60,
    price: 350000,
    color: "#4CAF50",
    category: "massage",
  },
  {
    id: "svc-massage-90",
    name: "Massage toàn thân 90'",
    duration: 90,
    price: 500000,
    color: "#4CAF50",
    category: "massage",
  },
  {
    id: "svc-facial-basic",
    name: "Chăm sóc da mặt cơ bản",
    duration: 45,
    price: 280000,
    color: "#2196F3",
    category: "facial",
  },
  {
    id: "svc-facial-premium",
    name: "Chăm sóc da mặt cao cấp",
    duration: 75,
    price: 550000,
    color: "#2196F3",
    category: "facial",
  },
  {
    id: "svc-body-scrub",
    name: "Tẩy tế bào chết body",
    duration: 45,
    price: 300000,
    color: "#9C27B0",
    category: "body-treatment",
  },
  {
    id: "svc-nail-gel",
    name: "Sơn gel tay",
    duration: 60,
    price: 200000,
    color: "#FF9800",
    category: "nail",
  },
  {
    id: "svc-sauna",
    name: "Xông hơi thảo dược",
    duration: 30,
    price: 150000,
    color: "#795548",
    category: "sauna",
  },
  {
    id: "svc-combo-relax",
    name: "Combo Thư giãn (Massage + Xông hơi)",
    duration: 120,
    price: 650000,
    color: "#00BCD4",
    category: "combo",
  },
];

// ============================================
// MOCK CUSTOMERS (Khách hàng)
// ============================================

export interface MockCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  membershipLevel: "regular" | "silver" | "gold" | "platinum";
}

export const MOCK_CUSTOMERS: MockCustomer[] = [
  {
    id: "cust-1",
    name: "Nguyễn Văn An",
    phone: "0912 345 678",
    email: "an.nguyen@email.com",
    membershipLevel: "gold",
  },
  {
    id: "cust-2",
    name: "Trần Thị Bình",
    phone: "0987 654 321",
    email: "binh.tran@email.com",
    membershipLevel: "platinum",
  },
  {
    id: "cust-3",
    name: "Lê Văn Cường",
    phone: "0909 111 222",
    membershipLevel: "regular",
  },
  {
    id: "cust-4",
    name: "Phạm Thị Dung",
    phone: "0918 333 444",
    email: "dung.pham@email.com",
    membershipLevel: "silver",
  },
  {
    id: "cust-5",
    name: "Hoàng Minh Đức",
    phone: "0977 555 666",
    membershipLevel: "gold",
  },
  {
    id: "cust-6",
    name: "Vũ Thị Hà",
    phone: "0933 777 888",
    email: "ha.vu@email.com",
    membershipLevel: "regular",
  },
  {
    id: "cust-7",
    name: "Đặng Văn Giáp",
    phone: "0944 999 000",
    membershipLevel: "silver",
  },
  {
    id: "cust-8",
    name: "Bùi Thị Hương",
    phone: "0955 123 456",
    email: "huong.bui@email.com",
    membershipLevel: "platinum",
  },
];

// ============================================
// MOCK APPOINTMENTS (Cuộc hẹn)
// ============================================

/**
 * Tạo mock appointments cho một tuần
 * Dựa trên ngày hiện tại
 */
export function generateMockAppointments(baseDate: Date = new Date()): Appointment[] {
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 }); // Bắt đầu từ T2
  const appointments: Appointment[] = [];

  // Helper để tạo appointment
  const createAppointment = (
    id: string,
    customerId: string,
    staffId: string,
    serviceId: string,
    date: Date,
    hour: number,
    minute: number = 0,
    status: Appointment["status"] = "confirmed",
    resourceId?: string
  ): Appointment => {
    const customer = MOCK_CUSTOMERS.find((c) => c.id === customerId)!;
    const staff = MOCK_STAFF.find((s) => s.id === staffId)!;
    const service = MOCK_SERVICES.find((s) => s.id === serviceId)!;
    const resource = resourceId
      ? MOCK_RESOURCES.find((r) => r.id === resourceId)
      : undefined;

    const startTime = setMinutes(setHours(date, hour), minute);
    const endTime = addHours(startTime, service.duration / 60);

    // NEW: Create booking item from the service
    const item = {
      serviceId: serviceId,
      serviceName: service.name,
      price: service.price,
      duration: service.duration,
      startTime: startTime,
      staffId: staffId,
      resourceId: resourceId,
    };

    return {
      id,
      customerId,
      customerName: customer.name,
      customerPhone: customer.phone,

      // NEW FIELDS
      items: [item],
      totalPrice: service.price,
      totalDuration: service.duration,

      // LEGACY MAP
      staffId,
      staffName: staff.name,
      staffAvatar: staff.avatar,
      serviceId,
      serviceName: service.name,
      serviceColor: service.color,
      resourceId,
      resourceName: resource?.name,

      startTime,
      endTime,
      duration: service.duration,
      status,
      notes: undefined,
      internalNotes: undefined,
      isRecurring: false,
      createdAt: subDays(startTime, 3),
      updatedAt: subDays(startTime, 1),
      createdBy: "admin",
    };
  };

  // Thứ 2
  const monday = weekStart;
  appointments.push(
    createAppointment(
      "apt-1",
      "cust-1",
      "staff-1",
      "svc-massage-60",
      monday,
      9,
      0,
      "confirmed",
      "room-vip-1"
    ),
    createAppointment(
      "apt-2",
      "cust-2",
      "staff-2",
      "svc-facial-basic",
      monday,
      9,
      30,
      "confirmed",
      "room-std-1"
    ),
    createAppointment(
      "apt-3",
      "cust-3",
      "staff-1",
      "svc-massage-90",
      monday,
      11,
      0,
      "pending",
      "room-vip-1"
    ),
    createAppointment(
      "apt-4",
      "cust-4",
      "staff-3",
      "svc-combo-relax",
      monday,
      14,
      0,
      "confirmed",
      "room-vip-2"
    )
  );

  // Thứ 3
  const tuesday = addDays(weekStart, 1);
  appointments.push(
    createAppointment(
      "apt-5",
      "cust-5",
      "staff-2",
      "svc-nail-gel",
      tuesday,
      10,
      0,
      "completed"
    ),
    createAppointment(
      "apt-6",
      "cust-6",
      "staff-1",
      "svc-massage-60",
      tuesday,
      10,
      0,
      "in_progress",
      "room-std-2"
    ),
    createAppointment(
      "apt-7",
      "cust-7",
      "staff-3",
      "svc-body-scrub",
      tuesday,
      13,
      30,
      "confirmed",
      "room-std-1"
    ),
    createAppointment(
      "apt-8",
      "cust-8",
      "staff-4",
      "svc-facial-premium",
      tuesday,
      15,
      0,
      "pending",
      "room-vip-1"
    )
  );

  // Thứ 4
  const wednesday = addDays(weekStart, 2);
  appointments.push(
    createAppointment(
      "apt-9",
      "cust-1",
      "staff-3",
      "svc-sauna",
      wednesday,
      8,
      0,
      "confirmed",
      "room-sauna"
    ),
    createAppointment(
      "apt-10",
      "cust-2",
      "staff-1",
      "svc-massage-90",
      wednesday,
      9,
      0,
      "confirmed",
      "room-vip-2"
    ),
    // Xung đột: 2 cuộc hẹn cùng KTV cùng giờ
    createAppointment(
      "apt-11",
      "cust-3",
      "staff-2",
      "svc-facial-basic",
      wednesday,
      11,
      0,
      "confirmed",
      "room-std-1"
    ),
    createAppointment(
      "apt-12",
      "cust-4",
      "staff-2",
      "svc-nail-gel",
      wednesday,
      11,
      30, // Overlap với apt-11
      "pending"
    )
  );

  // Thứ 5
  const thursday = addDays(weekStart, 3);
  appointments.push(
    createAppointment(
      "apt-13",
      "cust-5",
      "staff-4",
      "svc-nail-gel",
      thursday,
      9,
      0,
      "cancelled"
    ),
    createAppointment(
      "apt-14",
      "cust-6",
      "staff-1",
      "svc-combo-relax",
      thursday,
      10,
      0,
      "confirmed",
      "room-vip-1"
    ),
    createAppointment(
      "apt-15",
      "cust-7",
      "staff-2",
      "svc-facial-premium",
      thursday,
      14,
      0,
      "no_show",
      "room-std-2"
    )
  );

  // Thứ 6
  const friday = addDays(weekStart, 4);
  appointments.push(
    createAppointment(
      "apt-16",
      "cust-8",
      "staff-3",
      "svc-massage-60",
      friday,
      9,
      30,
      "confirmed",
      "room-std-1"
    ),
    createAppointment(
      "apt-17",
      "cust-1",
      "staff-1",
      "svc-facial-basic",
      friday,
      11,
      0,
      "confirmed",
      "room-vip-2"
    ),
    createAppointment(
      "apt-18",
      "cust-2",
      "staff-4",
      "svc-body-scrub",
      friday,
      15,
      0,
      "pending",
      "room-std-2"
    ),
    createAppointment(
      "apt-19",
      "cust-3",
      "staff-2",
      "svc-combo-relax",
      friday,
      16,
      0,
      "confirmed",
      "room-vip-1"
    )
  );

  // Thứ 7
  const saturday = addDays(weekStart, 5);
  appointments.push(
    createAppointment(
      "apt-20",
      "cust-4",
      "staff-1",
      "svc-massage-90",
      saturday,
      9,
      0,
      "confirmed",
      "room-vip-1"
    ),
    createAppointment(
      "apt-21",
      "cust-5",
      "staff-3",
      "svc-sauna",
      saturday,
      10,
      0,
      "confirmed",
      "room-sauna"
    ),
    createAppointment(
      "apt-22",
      "cust-6",
      "staff-2",
      "svc-facial-basic",
      saturday,
      10,
      30,
      "pending",
      "room-std-1"
    )
  );

  // Chủ nhật - ít hẹn hơn
  const sunday = addDays(weekStart, 6);
  appointments.push(
    createAppointment(
      "apt-23",
      "cust-7",
      "staff-1",
      "svc-combo-relax",
      sunday,
      10,
      0,
      "confirmed",
      "room-vip-2"
    )
  );

  return appointments;
}

// ============================================
// PRE-GENERATED MOCK DATA
// ============================================

export const MOCK_APPOINTMENTS = generateMockAppointments();

// ============================================
// HELPER: Convert Appointment to CalendarEvent
// ============================================

export function appointmentToCalendarEvent(appointment: Appointment): CalendarEvent {
  return {
    id: appointment.id,
    title: `${appointment.customerName} - ${appointment.serviceName}`,
    start: appointment.startTime,
    end: appointment.endTime,
    color: appointment.serviceColor || "#gray",
    status: appointment.status,
    staffId: appointment.staffId,
    staffName: appointment.staffName,
    resourceId: appointment.resourceId,
    isRecurring: appointment.isRecurring,
    appointment,
  };
}

export function appointmentsToCalendarEvents(appointments: Appointment[]): CalendarEvent[] {
  return appointments.map(appointmentToCalendarEvent);
}

// ============================================
// MOCK METRICS
// ============================================

export function getMockMetrics(date: Date = new Date()): AppointmentMetrics {
  const todayAppointments = MOCK_APPOINTMENTS.filter(
    (apt) => apt.startTime.toDateString() === date.toDateString()
  );

  const pending = todayAppointments.filter((apt) => apt.status === "pending").length;
  const completed = todayAppointments.filter((apt) => apt.status === "completed").length;
  const noShow = todayAppointments.filter((apt) => apt.status === "no_show").length;

  const totalSlots = 13 * 4 * MOCK_STAFF.filter((s) => s.isActive).length; // 13 giờ * 4 slots/giờ * số KTV
  const occupiedSlots = todayAppointments.reduce((acc, apt) => {
    return acc + Math.ceil(apt.duration / 15);
  }, 0);

  const revenue = todayAppointments
    .filter((apt) => apt.status === "completed" || apt.status === "confirmed")
    .reduce((acc, apt) => {
      const service = MOCK_SERVICES.find((s) => s.id === apt.serviceId);
      return acc + (service?.price || 0);
    }, 0);

  return {
    todayTotal: todayAppointments.length,
    todayPending: pending,
    todayCompleted: completed,
    occupancyRate: Math.round((occupiedSlots / totalSlots) * 100),
    estimatedRevenue: revenue,
    noShowRate: todayAppointments.length > 0 ? Math.round((noShow / todayAppointments.length) * 100) : 0,
  };
}
