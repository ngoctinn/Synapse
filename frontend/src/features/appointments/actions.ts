"use server";

import {
  type ActionResponse,
  error as createErrorResponse,
  success as createSuccessResponse,
} from "@/shared/lib/action-response";
import { executeAction } from "@/shared/lib/execute-action";
import { isWithinInterval } from "date-fns";
import {
  appointmentsToCalendarEvents,
  getMockMetrics,
  MOCK_APPOINTMENTS,
  MOCK_CUSTOMERS,
  MOCK_RESOURCES,
  MOCK_SERVICES,
  MOCK_STAFF,
} from "./model/mocks";
import type {
  Appointment,
  AppointmentFilters,
  ConflictInfo,
  DateRange,
} from "./model/types";

export async function getAppointments(
  dateRange: DateRange,
  filters?: Partial<AppointmentFilters>
) {
  return executeAction(
    "getAppointments",
    async () => {
      let apps = MOCK_APPOINTMENTS.filter((a) =>
        isWithinInterval(a.startTime, {
          start: dateRange.start,
          end: dateRange.end,
        })
      );

      if (filters?.staffIds?.length)
        apps = apps.filter((a) => filters.staffIds!.includes(a.staffId));
      if (filters?.resourceIds?.length)
        apps = apps.filter(
          (a) => a.resourceId && filters.resourceIds!.includes(a.resourceId)
        );
      if (filters?.statuses?.length)
        apps = apps.filter((a) => filters.statuses!.includes(a.status));
      if (filters?.serviceIds?.length) {
        apps = apps.filter(
          (a) =>
            (a.serviceId && filters.serviceIds!.includes(a.serviceId)) ||
            a.items?.some((i) => filters.serviceIds!.includes(i.serviceId))
        );
      }
      if (filters?.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        apps = apps.filter(
          (a) =>
            a.customerName.toLowerCase().includes(q) ||
            a.customerPhone.includes(q) ||
            (a.serviceName && a.serviceName.toLowerCase().includes(q))
        );
      }
      return appointmentsToCalendarEvents(apps);
    },
    "Không thể tải danh sách lịch hẹn"
  );
}

export async function getAppointmentById(id: string) {
  return executeAction(
    "getAppointmentById",
    async () => {
      const apt = MOCK_APPOINTMENTS.find((a) => a.id === id);
      if (!apt) throw new Error("Not found");
      return apt;
    },
    "Không tìm thấy lịch hẹn"
  );
}

export async function getAppointmentMetrics(date: Date = new Date()) {
  return executeAction(
    "getAppointmentMetrics",
    async () => getMockMetrics(date),
    "Không thể tải thống kê"
  );
}

export async function createAppointment(data: {
  customerId: string;
  serviceIds: string[];
  staffId: string;
  resourceId?: string;
  startTime: Date;
  notes?: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
}) {
  return executeAction(
    "createAppointment",
    async () => {
      if (!data.customerId || !data.staffId || !data.serviceIds.length)
        throw new Error("Missing fields");

      const customer = MOCK_CUSTOMERS.find((c) => c.id === data.customerId);
      const staff = MOCK_STAFF.find((s) => s.id === data.staffId);
      const service = MOCK_SERVICES.find((s) => s.id === data.serviceIds[0]);
      const resource = data.resourceId
        ? MOCK_RESOURCES.find((r) => r.id === data.resourceId)
        : undefined;
      if (!customer || !staff || !service) throw new Error("Invalid data");

      const conflicts = await checkConflictsLogic(
        data.staffId,
        data.startTime,
        new Date(data.startTime.getTime() + (service.duration || 60) * 60000)
      );
      if (conflicts.length > 0)
        throw new Error(`Xung đột lịch: ${conflicts[0].message}`);

      const bookingItems = data.serviceIds.map((sId) => {
        const s = MOCK_SERVICES.find((srv) => srv.id === sId)!;
        return {
          serviceId: sId,
          serviceName: s.name,
          price: s.price,
          duration: s.duration,
          startTime: data.startTime,
          staffId: data.staffId,
          resourceId: data.resourceId,
        };
      });

      const totalDuration = bookingItems.reduce((s, i) => s + i.duration, 0);
      const newAppointment: Appointment = {
        id: `apt-new-${Date.now()}`,
        customerId: data.customerId,
        customerName: customer.name,
        customerPhone: customer.phone,
        staffId: data.staffId,
        staffName: staff.name,
        staffAvatar: staff.avatar,
        items: bookingItems,
        totalPrice: bookingItems.reduce((s, i) => s + i.price, 0),
        totalDuration,
        serviceId: data.serviceIds[0],
        serviceName: service.name,
        serviceColor: service.color,
        resourceId: data.resourceId,
        resourceName: resource?.name,
        startTime: data.startTime,
        endTime: new Date(data.startTime.getTime() + totalDuration * 60000),
        duration: totalDuration,
        status: "PENDING",
        notes: data.notes,
        isRecurring: data.isRecurring || false,
        recurrenceRule: data.recurrenceRule,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "current-user",
      };

      MOCK_APPOINTMENTS.push(newAppointment);
      return newAppointment;
    },
    "Không thể tạo lịch hẹn"
  );
}

export async function updateAppointment(
  id: string,
  data: Partial<Appointment>
) {
  return executeAction(
    "updateAppointment",
    async () => {
      const existing = MOCK_APPOINTMENTS.find((a) => a.id === id);
      if (!existing) throw new Error("Not found");
      Object.assign(existing, { ...data, updatedAt: new Date() });
      return existing;
    },
    "Không thể cập nhật lịch hẹn"
  );
}

export async function updateAppointmentTime(
  id: string,
  startTime: Date,
  endTime: Date
) {
  return executeAction(
    "updateAppointmentTime",
    async () => {
      const existing = MOCK_APPOINTMENTS.find((a) => a.id === id);
      if (!existing) throw new Error("Not found");
      if (startTime < new Date()) throw new Error("Past time");

      const conflicts = await checkConflictsLogic(
        existing.staffId,
        startTime,
        endTime,
        id
      );
      if (conflicts.length > 0)
        throw new Error(`Xung đột: ${conflicts[0].message}`);

      Object.assign(existing, {
        startTime,
        endTime,
        duration: Math.round((endTime.getTime() - startTime.getTime()) / 60000),
        updatedAt: new Date(),
      });
      return existing;
    },
    "Không thể cập nhật thời gian"
  );
}

export async function deleteAppointment(id: string) {
  return executeAction(
    "deleteAppointment",
    async () => {
      const idx = MOCK_APPOINTMENTS.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error("Not found");
      // MOCK: In reality we might splice or mark deleted. For now just check existence.
      return null;
    },
    "Không thể xóa lịch hẹn"
  );
}

export async function checkInAppointment(id: string) {
  return executeAction("checkInAppointment", async () => {
    const existing = MOCK_APPOINTMENTS.find((a) => a.id === id);
    if (!existing || existing.status !== "CONFIRMED")
      throw new Error("Invalid state");
    existing.status = "IN_PROGRESS";
    existing.updatedAt = new Date();
    return existing;
  });
}

export async function markNoShow(id: string) {
  return executeAction("markNoShow", async () => {
    const existing = MOCK_APPOINTMENTS.find((a) => a.id === id);
    if (!existing || existing.status !== "CONFIRMED")
      throw new Error("Invalid state");
    existing.status = "NO_SHOW";
    existing.updatedAt = new Date();
    return existing;
  });
}

export async function cancelAppointment(id: string, reason?: string) {
  return executeAction("cancelAppointment", async () => {
    const existing = MOCK_APPOINTMENTS.find((a) => a.id === id);
    if (!existing || ["CANCELLED", "COMPLETED"].includes(existing.status))
      throw new Error("Invalid state");
    existing.status = "CANCELLED";
    existing.updatedAt = new Date();
    if (reason)
      existing.notes = `${existing.notes || ""}\n[Lý do hủy]: ${reason}`.trim();
    return existing;
  });
}

async function checkConflictsLogic(
  staffId: string,
  startTime: Date,
  endTime: Date,
  excludeId?: string
): Promise<ConflictInfo[]> {
  const overlapping = MOCK_APPOINTMENTS.filter((apt) => {
    if (
      apt.id === excludeId ||
      apt.staffId !== staffId ||
      ["CANCELLED", "NO_SHOW"].includes(apt.status)
    )
      return false;
    return apt.startTime < endTime && apt.endTime > startTime;
  });

  return overlapping.map((apt) => ({
    eventId: apt.id,
    conflictsWith: [apt.id],
    type: "overlap",
    severity: "error",
    message: `${apt.staffName} đã có hẹn "${apt.serviceName}" lúc ${apt.startTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`,
  }));
}

export async function checkConflicts(
  staffId: string,
  startTime: Date,
  endTime: Date,
  excludeId?: string
) {
  return executeAction(
    "checkConflicts",
    async () => checkConflictsLogic(staffId, startTime, endTime, excludeId),
    "Không thể kiểm tra xung đột"
  );
}

export async function getStaffList() {
  return executeAction(
    "getStaffList",
    async () => MOCK_STAFF.filter((s) => s.isActive),
    "Không thể tải danh sách nhân viên"
  );
}

export async function getResourceList() {
  return executeAction(
    "getResourceList",
    async () => MOCK_RESOURCES.filter((r) => r.isActive),
    "Không thể tải danh sách tài nguyên"
  );
}

export async function getServiceList() {
  return executeAction(
    "getServiceList",
    async () => MOCK_SERVICES,
    "Không thể tải danh sách dịch vụ"
  );
}

export async function searchCustomers(query: string) {
  return executeAction(
    "searchCustomers",
    async () => {
      if (!query || query.length < 2) return [];
      return MOCK_CUSTOMERS.filter(
        (c) =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.phone.includes(query)
      );
    },
    "Không thể tìm kiếm khách hàng"
  );
}
