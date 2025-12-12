"use server";

/**
 * Server Actions - Module Quản lý Lịch hẹn
 *
 * Các hành động server-side cho CRUD operations.
 * Hiện tại sử dụng Mock Data (Backend chưa sẵn sàng).
 *
 * TODO: Thay thế mock bằng Supabase queries khi backend ready.
 */

import {
    type ActionResponse,
    error as createErrorResponse,
    success as createSuccessResponse,
} from "@/shared/lib/action-response";
import { isWithinInterval } from "date-fns";
import type { MockCustomer, MockService } from "./mock-data";
import {
    appointmentsToCalendarEvents,
    getMockMetrics,
    MOCK_APPOINTMENTS,
    MOCK_CUSTOMERS,
    MOCK_RESOURCES,
    MOCK_SERVICES,
    MOCK_STAFF
} from "./mock-data";
import type {
    Appointment,
    AppointmentFilters,
    AppointmentMetrics,
    CalendarEvent,
    ConflictInfo,
    DateRange,
    TimelineResource,
} from "./types";

// ============================================
// SIMULATED DELAY (cho realistic UX testing)
// ============================================

const SIMULATED_DELAY_MS = 300;

async function simulateDelay(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY_MS));
}

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Lấy danh sách lịch hẹn theo khoảng thời gian và bộ lọc
 */
export async function getAppointments(
  dateRange: DateRange,
  filters?: Partial<AppointmentFilters>
): Promise<ActionResponse<CalendarEvent[]>> {
  try {
    await simulateDelay();

    // Filter theo date range
    let appointments = MOCK_APPOINTMENTS.filter((apt) =>
      isWithinInterval(apt.startTime, {
        start: dateRange.start,
        end: dateRange.end,
      })
    );

    // Apply filters
    if (filters) {
      if (filters.staffIds?.length) {
        appointments = appointments.filter((apt) =>
          filters.staffIds!.includes(apt.staffId)
        );
      }

      if (filters.serviceIds?.length) {
        appointments = appointments.filter((apt) =>
          // Check legacy serviceId (if exists)
          (apt.serviceId && filters.serviceIds!.includes(apt.serviceId)) ||
          // Check items array
          apt.items?.some(item => filters.serviceIds!.includes(item.serviceId))
        );
      }

      if (filters.resourceIds?.length) {
        appointments = appointments.filter(
          (apt) => apt.resourceId && filters.resourceIds!.includes(apt.resourceId)
        );
      }

      if (filters.statuses?.length) {
        appointments = appointments.filter((apt) =>
          filters.statuses!.includes(apt.status)
        );
      }

      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        appointments = appointments.filter(
          (apt) =>
            apt.customerName.toLowerCase().includes(query) ||
            apt.customerPhone.includes(query) ||
            (apt.serviceName && apt.serviceName.toLowerCase().includes(query))
        );
      }
    }

    const events = appointmentsToCalendarEvents(appointments);

    return createSuccessResponse(events);
  } catch (error) {
    console.error("getAppointments error:", error);
    return createErrorResponse("Không thể tải danh sách lịch hẹn");
  }
}

/**
 * Lấy chi tiết một cuộc hẹn
 */
export async function getAppointmentById(
  id: string
): Promise<ActionResponse<Appointment | null>> {
  try {
    await simulateDelay();

    const appointment = MOCK_APPOINTMENTS.find((apt) => apt.id === id);

    if (!appointment) {
      return createErrorResponse("Không tìm thấy lịch hẹn");
    }

    return createSuccessResponse(appointment);
  } catch (error) {
    console.error("getAppointmentById error:", error);
    return createErrorResponse("Không thể tải thông tin lịch hẹn");
  }
}

/**
 * Lấy thống kê Dashboard
 */
export async function getAppointmentMetrics(
  date: Date = new Date()
): Promise<ActionResponse<AppointmentMetrics>> {
  try {
    await simulateDelay();

    const metrics = getMockMetrics(date);

    return createSuccessResponse(metrics);
  } catch (error) {
    console.error("getAppointmentMetrics error:", error);
    return createErrorResponse("Không thể tải thống kê");
  }
}

// ============================================
// WRITE OPERATIONS (MOCK - Không persist)
// ============================================

/**
 * Tạo cuộc hẹn mới
 *
 * @note MOCK: Chỉ return success, không lưu vào database
 */
export async function createAppointment(
  data: {
    customerId: string;
    serviceIds: string[];
    staffId: string;
    resourceId?: string;
    startTime: Date;
    notes?: string;
    isRecurring?: boolean;
    recurrenceRule?: string;
  }
): Promise<ActionResponse<Appointment>> {
  try {
    await simulateDelay();

    // Validate required fields
    if (!data.customerId || !data.staffId || data.serviceIds.length === 0) {
      return createErrorResponse("Thiếu thông tin bắt buộc");
    }

    // Get related data
    const customer = MOCK_CUSTOMERS.find((c) => c.id === data.customerId);
    const staff = MOCK_STAFF.find((s) => s.id === data.staffId);
    const service = MOCK_SERVICES.find((s) => s.id === data.serviceIds[0]);
    const resource = data.resourceId
      ? MOCK_RESOURCES.find((r) => r.id === data.resourceId)
      : undefined;

    if (!customer || !staff || !service) {
      return createErrorResponse("Dữ liệu không hợp lệ");
    }

    // Check conflicts
    const conflicts = await checkConflicts(
      data.staffId,
      data.startTime,
      new Date(data.startTime.getTime() + (service?.duration || 60) * 60 * 1000)
    );

    if (conflicts.data && conflicts.data.length > 0) {
      return createErrorResponse(
        `Xung đột lịch: ${conflicts.data[0].message}`
      );
    }

    // Create booking items
    const bookingItems = data.serviceIds.map(sId => {
        const s = MOCK_SERVICES.find(srv => srv.id === sId);
        return {
            serviceId: sId,
            serviceName: s?.name || "",
            price: s?.price || 0,
            duration: s?.duration || 0,
            startTime: data.startTime,
            staffId: data.staffId,
            resourceId: data.resourceId
        };
    });

    const totalDuration = bookingItems.reduce((sum, item) => sum + item.duration, 0);
    const totalPrice = bookingItems.reduce((sum, item) => sum + item.price, 0);
    const endTime = new Date(data.startTime.getTime() + totalDuration * 60 * 1000);

    // Create mock appointment
    const newAppointment: Appointment = {
      id: `apt-new-${Date.now()}`,
      customerId: data.customerId,
      customerName: customer.name,
      customerPhone: customer.phone,
      staffId: data.staffId,
      staffName: staff.name,
      staffAvatar: staff.avatar,

      // NEW FIELDS
      items: bookingItems,
      totalPrice,
      totalDuration,

      // LEGACY MAPPINGS
      serviceId: data.serviceIds[0],
      serviceName: service.name,
      serviceColor: service.color,
      resourceId: data.resourceId,
      resourceName: resource?.name,

      startTime: data.startTime,
      endTime,
      duration: totalDuration,
      status: "pending",
      notes: data.notes,
      isRecurring: data.isRecurring || false,
      recurrenceRule: data.recurrenceRule,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: "current-user",
    };

    // NOTE: Trong thực tế, sẽ insert vào database ở đây
    MOCK_APPOINTMENTS.push(newAppointment);

    return createSuccessResponse(newAppointment, "Tạo lịch hẹn thành công");
  } catch (error) {
    console.error("createAppointment error:", error);
    return createErrorResponse("Không thể tạo lịch hẹn");
  }
}

/**
 * Cập nhật cuộc hẹn
 *
 * @note MOCK: Chỉ return success, không persist
 */
export async function updateAppointment(
  id: string,
  data: Partial<{
    customerId: string;
    serviceIds: string[];
    staffId: string;
    resourceId: string;
    startTime: Date;
    endTime: Date;
    status: Appointment["status"];
    notes: string;
    internalNotes: string;
  }>
): Promise<ActionResponse<Appointment>> {
  try {
    await simulateDelay();

    const existing = MOCK_APPOINTMENTS.find((apt) => apt.id === id);

    if (!existing) {
      return createErrorResponse("Không tìm thấy lịch hẹn");
    }

    // Merge data
    const updated: Appointment = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };

    // NOTE: Trong thực tế, sẽ update database ở đây

    return createSuccessResponse(updated, "Cập nhật thành công");
  } catch (error) {
    console.error("updateAppointment error:", error);
    return createErrorResponse("Không thể cập nhật lịch hẹn");
  }
}

/**
 * Cập nhật thời gian cuộc hẹn (khi drag-drop)
 */
export async function updateAppointmentTime(
  id: string,
  startTime: Date,
  endTime: Date
): Promise<ActionResponse<Appointment>> {
  try {
    await simulateDelay();

    const existing = MOCK_APPOINTMENTS.find((apt) => apt.id === id);

    if (!existing) {
      return createErrorResponse("Không tìm thấy lịch hẹn");
    }

    // Check if new time is in the past
    if (startTime < new Date()) {
      return createErrorResponse("Không thể đặt lịch vào thời gian đã qua");
    }

    // Check conflicts (excluding self)
    const conflicts = await checkConflicts(
      existing.staffId,
      startTime,
      endTime,
      id
    );

    if (conflicts.data && conflicts.data.length > 0) {
      return createErrorResponse(
        `Xung đột lịch: ${conflicts.data[0].message}`
      );
    }

    const updated: Appointment = {
      ...existing,
      startTime,
      endTime,
      duration: Math.round((endTime.getTime() - startTime.getTime()) / 60000),
      updatedAt: new Date(),
    };

    return createSuccessResponse(updated, "Đã cập nhật thời gian");
  } catch (error) {
    console.error("updateAppointmentTime error:", error);
    return createErrorResponse("Không thể cập nhật thời gian");
  }
}

/**
 * Xóa cuộc hẹn
 */
export async function deleteAppointment(
  id: string
): Promise<ActionResponse<null>> {
  try {
    await simulateDelay();

    const existing = MOCK_APPOINTMENTS.find((apt) => apt.id === id);

    if (!existing) {
      return createErrorResponse("Không tìm thấy lịch hẹn");
    }

    // NOTE: Trong thực tế, sẽ delete từ database ở đây

    return createSuccessResponse(null, "Đã xóa lịch hẹn");
  } catch (error) {
    console.error("deleteAppointment error:", error);
    return createErrorResponse("Không thể xóa lịch hẹn");
  }
}

/**
 * Check-in khách hàng
 * Cập nhật trạng thái từ "confirmed" → "in_progress"
 */
export async function checkInAppointment(
  id: string
): Promise<ActionResponse<Appointment>> {
  try {
    await simulateDelay();

    const existing = MOCK_APPOINTMENTS.find((apt) => apt.id === id);

    if (!existing) {
      return createErrorResponse("Không tìm thấy lịch hẹn");
    }

    if (existing.status !== "confirmed") {
      return createErrorResponse("Chỉ có thể check-in lịch hẹn đã xác nhận");
    }

    const updated: Appointment = {
      ...existing,
      status: "in_progress",
      updatedAt: new Date(),
    };

    // NOTE: Trong thực tế, sẽ update database ở đây

    return createSuccessResponse(updated, "Check-in thành công");
  } catch (error) {
    console.error("checkInAppointment error:", error);
    return createErrorResponse("Không thể check-in");
  }
}

/**
 * Đánh dấu khách không đến (No-Show)
 * Cập nhật trạng thái từ "confirmed" → "no_show"
 */
export async function markNoShow(
  id: string
): Promise<ActionResponse<Appointment>> {
  try {
    await simulateDelay();

    const existing = MOCK_APPOINTMENTS.find((apt) => apt.id === id);

    if (!existing) {
      return createErrorResponse("Không tìm thấy lịch hẹn");
    }

    if (existing.status !== "confirmed") {
      return createErrorResponse("Chỉ có thể đánh dấu no-show cho lịch hẹn đã xác nhận");
    }

    const updated: Appointment = {
      ...existing,
      status: "no_show",
      updatedAt: new Date(),
    };

    // NOTE: Trong thực tế, sẽ update database ở đây

    return createSuccessResponse(updated, "Đã đánh dấu khách không đến");
  } catch (error) {
    console.error("markNoShow error:", error);
    return createErrorResponse("Không thể đánh dấu no-show");
  }
}

/**
 * Hủy lịch hẹn
 * Cập nhật trạng thái → "cancelled"
 */
export async function cancelAppointment(
  id: string,
  reason?: string
): Promise<ActionResponse<Appointment>> {
  try {
    await simulateDelay();

    const existing = MOCK_APPOINTMENTS.find((apt) => apt.id === id);

    if (!existing) {
      return createErrorResponse("Không tìm thấy lịch hẹn");
    }

    if (existing.status === "cancelled" || existing.status === "completed") {
      return createErrorResponse("Không thể hủy lịch hẹn này");
    }

    const updated: Appointment = {
      ...existing,
      status: "cancelled",
      notes: reason ? `${existing.notes || ""}\n[Lý do hủy]: ${reason}`.trim() : existing.notes,
      updatedAt: new Date(),
    };

    // NOTE: Trong thực tế, sẽ update database ở đây

    return createSuccessResponse(updated, "Đã hủy lịch hẹn");
  } catch (error) {
    console.error("cancelAppointment error:", error);
    return createErrorResponse("Không thể hủy lịch hẹn");
  }
}

// ============================================
// CONFLICT DETECTION
// ============================================

/**
 * Kiểm tra xung đột lịch hẹn
 */
export async function checkConflicts(
  staffId: string,
  startTime: Date,
  endTime: Date,
  excludeId?: string
): Promise<ActionResponse<ConflictInfo[]>> {
  try {
    await simulateDelay();

    const conflicts: ConflictInfo[] = [];

    // Tìm các cuộc hẹn của cùng KTV trong khoảng thời gian
    const overlapping = MOCK_APPOINTMENTS.filter((apt) => {
      if (apt.id === excludeId) return false;
      if (apt.staffId !== staffId) return false;
      if (apt.status === "cancelled" || apt.status === "no_show") return false;

      // Check overlap
      return apt.startTime < endTime && apt.endTime > startTime;
    });

    for (const apt of overlapping) {
      conflicts.push({
        eventId: apt.id,
        conflictsWith: [apt.id],
        type: "overlap",
        severity: "error",
        message: `${apt.staffName} đã có hẹn "${apt.serviceName}" lúc ${apt.startTime.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`,
      });
    }

    return createSuccessResponse(conflicts);
  } catch (error) {
    console.error("checkConflicts error:", error);
    return createErrorResponse("Không thể kiểm tra xung đột");
  }
}

// ============================================
// REFERENCE DATA
// ============================================

/**
 * Lấy danh sách Kỹ thuật viên
 */
export async function getStaffList(): Promise<ActionResponse<TimelineResource[]>> {
  try {
    await simulateDelay();
    return createSuccessResponse(MOCK_STAFF.filter((s) => s.isActive));
  } catch (error) {
    return createErrorResponse("Không thể tải danh sách nhân viên");
  }
}

/**
 * Lấy danh sách Phòng/Giường
 */
export async function getResourceList(): Promise<ActionResponse<TimelineResource[]>> {
  try {
    await simulateDelay();
    return createSuccessResponse(MOCK_RESOURCES.filter((r) => r.isActive));
  } catch (error) {
    return createErrorResponse("Không thể tải danh sách tài nguyên");
  }
}

/**
 * Lấy danh sách Dịch vụ
 */
export async function getServiceList(): Promise<ActionResponse<MockService[]>> {
  try {
    await simulateDelay();
    return createSuccessResponse(MOCK_SERVICES);
  } catch (error) {
    return createErrorResponse("Không thể tải danh sách dịch vụ");
  }
}

/**
 * Lấy danh sách Khách hàng (cho search/autocomplete)
 */
export async function searchCustomers(
  query: string
): Promise<ActionResponse<MockCustomer[]>> {
  try {
    await simulateDelay();

    if (!query || query.length < 2) {
      return createSuccessResponse([]);
    }

    const results = MOCK_CUSTOMERS.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.phone.includes(query)
    );

    return createSuccessResponse(results);
  } catch (error) {
    return createErrorResponse("Không thể tìm kiếm khách hàng");
  }
}
