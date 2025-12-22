/**
 * Mock Data - Module Quản lý Lịch hẹn
 */

import { addDays, addHours, setHours, setMinutes, startOfWeek, subDays } from "date-fns";
import type { Appointment, AppointmentMetrics, CalendarEvent, TimelineResource } from "./types";



export const MOCK_STAFF: TimelineResource[] = [
  { id: "staff-1", type: "staff", name: "Nguyễn Thị Thảo", avatar: "/avatars/thao.jpg", color: "#4CAF50", isActive: true, skills: ["massage", "facial", "body-treatment"] },
  { id: "staff-2", type: "staff", name: "Trần Linh Chi", avatar: "/avatars/chi.jpg", color: "#2196F3", isActive: true, skills: ["facial", "nail", "waxing"] },
  { id: "staff-3", type: "staff", name: "Lê Minh Hương", avatar: "/avatars/huong.jpg", color: "#9C27B0", isActive: true, skills: ["massage", "body-treatment", "sauna"] },
  { id: "staff-4", type: "staff", name: "Phạm Thanh Tâm", avatar: "/avatars/tam.jpg", color: "#FF9800", isActive: true, skills: ["nail", "hair", "makeup"] },
  { id: "staff-5", type: "staff", name: "Võ Hồng Nhung", avatar: "/avatars/nhung.jpg", color: "#E91E63", isActive: false, skills: ["massage", "facial"] },
];

export const MOCK_RESOURCES: TimelineResource[] = [
  { id: "room-vip-1", type: "room", name: "Phòng VIP 1", color: "#FFD700", isActive: true },
  { id: "room-vip-2", type: "room", name: "Phòng VIP 2", color: "#FFD700", isActive: true },
  { id: "room-std-1", type: "room", name: "Phòng Thường 1", color: "#C0C0C0", isActive: true },
  { id: "room-std-2", type: "room", name: "Phòng Thường 2", color: "#C0C0C0", isActive: true },
  { id: "room-sauna", type: "room", name: "Phòng Xông hơi", color: "#8B4513", isActive: true },
];

export interface MockService {
  id: string;
  name: string;
  duration: number;
  buffer_time: number;
  price: number;
  color: string;
  category: string;
}

export const MOCK_SERVICES: MockService[] = [
  { id: "svc-massage-60", name: "Massage toàn thân 60'", duration: 60, buffer_time: 15, price: 350000, color: "#4CAF50", category: "massage" },
  { id: "svc-massage-90", name: "Massage toàn thân 90'", duration: 90, buffer_time: 15, price: 500000, color: "#4CAF50", category: "massage" },
  { id: "svc-facial-basic", name: "Chăm sóc da mặt cơ bản", duration: 45, buffer_time: 10, price: 280000, color: "#2196F3", category: "facial" },
  { id: "svc-facial-premium", name: "Chăm sóc da mặt cao cấp", duration: 75, buffer_time: 15, price: 550000, color: "#2196F3", category: "facial" },
  { id: "svc-body-scrub", name: "Tẩy tế bào chết body", duration: 45, buffer_time: 10, price: 300000, color: "#9C27B0", category: "body-treatment" },
  { id: "svc-nail-gel", name: "Sơn gel tay", duration: 60, buffer_time: 5, price: 200000, color: "#FF9800", category: "nail" },
  { id: "svc-sauna", name: "Xông hơi thảo dược", duration: 30, buffer_time: 10, price: 150000, color: "#795548", category: "sauna" },
  { id: "svc-combo-relax", name: "Combo Thư giãn (Massage + Xông hơi)", duration: 120, buffer_time: 20, price: 650000, color: "#00BCD4", category: "combo" },
];

export interface MockCustomer {
  id: string; name: string; phone: string; email?: string; avatar?: string; membershipLevel: "REGULAR" | "SILVER" | "GOLD" | "PLATINUM";
}

export const MOCK_CUSTOMERS: MockCustomer[] = [
  { id: "cust-1", name: "Nguyễn Văn An", phone: "0912 345 678", email: "an.nguyen@email.com", membershipLevel: "GOLD" },
  { id: "cust-2", name: "Trần Thị Bình", phone: "0987 654 321", email: "binh.tran@email.com", membershipLevel: "PLATINUM" },
  { id: "cust-3", name: "Lê Văn Cường", phone: "0909 111 222", membershipLevel: "REGULAR" },
  { id: "cust-4", name: "Phạm Thị Dung", phone: "0918 333 444", email: "dung.pham@email.com", membershipLevel: "SILVER" },
  { id: "cust-5", name: "Hoàng Minh Đức", phone: "0977 555 666", membershipLevel: "GOLD" },
  { id: "cust-6", name: "Vũ Thị Hà", phone: "0933 777 888", email: "ha.vu@email.com", membershipLevel: "REGULAR" },
  { id: "cust-7", name: "Đặng Văn Giáp", phone: "0944 999 000", membershipLevel: "SILVER" },
  { id: "cust-8", name: "Bùi Thị Hương", phone: "0955 123 456", email: "huong.bui@email.com", membershipLevel: "PLATINUM" },
];



export function generateMockAppointments(baseDate: Date = new Date()): Appointment[] {
  const weekStart = startOfWeek(baseDate, { weekStartsOn: 1 });

  const createApt = (
    idSuffix: number, cId: string, sId: string, svcId: string,
    dayOffset: number, h: number, m: number = 0,
    status: Appointment["status"] = "CONFIRMED", rId?: string
  ): Appointment => {
    const cust = MOCK_CUSTOMERS.find(c => c.id === cId)!;
    const staff = MOCK_STAFF.find(s => s.id === sId)!;
    const svc = MOCK_SERVICES.find(s => s.id === svcId)!;
    const resource = rId ? MOCK_RESOURCES.find(r => r.id === rId) : undefined;
    const start = setMinutes(setHours(addDays(weekStart, dayOffset), h), m);
    const end = addHours(start, svc.duration / 60);

    return {
      id: `apt-${idSuffix}`, customerId: cId, customerName: cust.name, customerPhone: cust.phone,
      items: [{ serviceId: svcId, serviceName: svc.name, price: svc.price, duration: svc.duration, startTime: start, staffId: sId, resourceId: rId }],
      totalPrice: svc.price, totalDuration: svc.duration,
      staffId: sId, staffName: staff.name, staffAvatar: staff.avatar,
      serviceId: svcId, serviceName: svc.name, serviceColor: svc.color,
      resourceId: rId, resourceName: resource?.name,
      startTime: start, endTime: end, duration: svc.duration, status, isRecurring: false,
      createdAt: subDays(start, 3), updatedAt: subDays(start, 1), createdBy: "admin"
    };
  };

  return [
    // List of appointments by Day

    createApt(1, "cust-1", "staff-1", "svc-massage-60", 0, 9, 0, "CONFIRMED", "room-vip-1"),
    createApt(2, "cust-2", "staff-2", "svc-facial-basic", 0, 9, 30, "CONFIRMED", "room-std-1"),
    createApt(3, "cust-3", "staff-1", "svc-massage-90", 0, 11, 0, "PENDING", "room-vip-1"),
    createApt(4, "cust-4", "staff-3", "svc-combo-relax", 0, 14, 0, "CONFIRMED", "room-vip-2"),

    createApt(5, "cust-5", "staff-2", "svc-nail-gel", 1, 10, 0, "COMPLETED"),
    createApt(6, "cust-6", "staff-1", "svc-massage-60", 1, 10, 0, "IN_PROGRESS", "room-std-2"),
    createApt(7, "cust-7", "staff-3", "svc-body-scrub", 1, 13, 30, "CONFIRMED", "room-std-1"),
    createApt(8, "cust-8", "staff-4", "svc-facial-premium", 1, 15, 0, "PENDING", "room-vip-1"),

    createApt(9, "cust-1", "staff-3", "svc-sauna", 2, 8, 0, "CONFIRMED", "room-sauna"),
    createApt(10, "cust-2", "staff-1", "svc-massage-90", 2, 9, 0, "CONFIRMED", "room-vip-2"),
    createApt(11, "cust-3", "staff-2", "svc-facial-basic", 2, 11, 0, "CONFIRMED", "room-std-1"),
    createApt(12, "cust-4", "staff-2", "svc-nail-gel", 2, 11, 30, "PENDING"),

    createApt(13, "cust-5", "staff-4", "svc-nail-gel", 3, 9, 0, "CANCELLED"),
    createApt(14, "cust-6", "staff-1", "svc-combo-relax", 3, 10, 0, "CONFIRMED", "room-vip-1"),
    createApt(15, "cust-7", "staff-2", "svc-facial-premium", 3, 14, 0, "NO_SHOW", "room-std-2"),

    createApt(16, "cust-8", "staff-3", "svc-massage-60", 4, 9, 30, "CONFIRMED", "room-std-1"),
    createApt(17, "cust-1", "staff-1", "svc-facial-basic", 4, 11, 0, "CONFIRMED", "room-vip-2"),
    createApt(18, "cust-2", "staff-4", "svc-body-scrub", 4, 15, 0, "PENDING", "room-std-2"),
    createApt(19, "cust-3", "staff-2", "svc-combo-relax", 4, 16, 0, "CONFIRMED", "room-vip-1"),

    createApt(20, "cust-4", "staff-1", "svc-massage-90", 5, 9, 0, "CONFIRMED", "room-vip-1"),
    createApt(21, "cust-5", "staff-3", "svc-sauna", 5, 10, 0, "CONFIRMED", "room-sauna"),
    createApt(22, "cust-6", "staff-2", "svc-facial-basic", 5, 10, 30, "PENDING", "room-std-1"),

    createApt(23, "cust-7", "staff-1", "svc-combo-relax", 6, 10, 0, "CONFIRMED", "room-vip-2"),
  ];
}

export const MOCK_APPOINTMENTS = generateMockAppointments();

export function appointmentToCalendarEvent(appointment: Appointment): CalendarEvent {
  return {
    id: appointment.id,
    title: `${appointment.customerName} - ${appointment.serviceName}`,
    start: appointment.startTime, end: appointment.endTime, color: appointment.serviceColor || "#gray",
    status: appointment.status, staffId: appointment.staffId, staffName: appointment.staffName,
    resourceId: appointment.resourceId, isRecurring: appointment.isRecurring, appointment,
  };
}

export function appointmentsToCalendarEvents(appointments: Appointment[]): CalendarEvent[] {
  return appointments.map(appointmentToCalendarEvent);
}

export function getMockMetrics(date: Date = new Date()): AppointmentMetrics {
  const todayApts = MOCK_APPOINTMENTS.filter(a => a.startTime.toDateString() === date.toDateString());
  const pending = todayApts.filter(a => a.status === "PENDING").length;
  const totalSlots = 13 * 4 * MOCK_STAFF.filter(s => s.isActive).length;
  const occupiedSlots = todayApts.reduce((acc, a) => acc + Math.ceil(a.duration / 15), 0);
  const revenue = todayApts
    .filter(a => ["COMPLETED", "CONFIRMED"].includes(a.status))
    .reduce((acc, a) => acc + (MOCK_SERVICES.find(s => s.id === a.serviceId)?.price || 0), 0);

  return {
    todayTotal: todayApts.length, todayPending: pending,
    todayCompleted: todayApts.filter(a => a.status === "COMPLETED").length,
    occupancyRate: Math.round((occupiedSlots / totalSlots) * 100),
    estimatedRevenue: revenue,
    noShowRate: todayApts.length > 0 ? Math.round((todayApts.filter(a => a.status === "NO_SHOW").length / todayApts.length) * 100) : 0,
  };
}
