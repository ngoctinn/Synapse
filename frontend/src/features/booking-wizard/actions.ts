"use server";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { format } from "date-fns";
import { getServices } from "../services/actions";
import { getStaffList } from "../staff/actions";
import { ServiceItem, StaffItem, TimeSlot } from "./types";
import { fetchWithAuth } from "@/shared/lib/api";

// ... (getServicesForBooking and getAvailableStaff remain unchanged)

export async function getServicesForBooking(): Promise<
  ActionResponse<Record<string, ServiceItem[]>>
> {
  try {
    // Fetch all active services using existing module
    // Passing a large limit to get all services for now
    const response = await getServices(1, 100, undefined, true);

    if (response.status === "error" || !response.data) {
      return error(response.message || "Failed to load services");
    }

    const services = response.data.data;
    const groupedServices: Record<string, ServiceItem[]> = {};

    services.forEach((service) => {
      const categoryName = service.category?.name || "Khác";

      if (!groupedServices[categoryName]) {
        groupedServices[categoryName] = [];
      }

      groupedServices[categoryName].push({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category_id: service.category?.id || service.category_id!,
        image_url: service.image_url,
      });
    });

    return success(groupedServices);
  } catch (err) {
    console.error("Error fetching booking services:", err);
    return error("Failed to load services");
  }
}

export async function getAvailableStaff(_params: {
  serviceIds: string[];
  date?: Date;
}): Promise<ActionResponse<StaffItem[]>> {
  try {
    // Fetch all staff
    const staffResponse = await getStaffList(1, 100);
    if (staffResponse.status === "error" || !staffResponse.data) {
      return error(staffResponse.message || "Failed to load staff");
    }

    // Filter staff who are technicians and active
    // In a real app, we would also check if they have the skills for the selected services
    // and check availability for the date
    const technicians = staffResponse.data.data.filter(
      (s) => s.user.role === "technician" && s.user.is_active
    );

    const staffItems: StaffItem[] = technicians.map((tech) => ({
      id: tech.user_id, // Map user_id to id
      name: tech.user.full_name || "Nhân viên",
      role: tech.title,
      avatar_url: tech.user.avatar_url || undefined,
      rating: 5.0, // Mock rating
      is_available: true, // Mock availability
    }));

    return success(staffItems);
  } catch (err) {
    console.error("Error fetching available staff:", err);
    return error("Failed to load staff");
  }
}

export async function getAvailableSlots(params: {
  serviceIds: string[];
  staffId: string;
  date: Date;
}): Promise<ActionResponse<TimeSlot[]>> {
  try {
    const { staffId, date, serviceIds } = params;

    // We use the first service as the primary one for the backend API for now
    // as the backend find-slots currently only accepts a single service_id.
    // In a future refactor, the backend should support multiple service_ids.
    if (serviceIds.length === 0) return success([]);

    const body = {
      service_id: serviceIds[0],
      target_date: format(date, "yyyy-MM-dd"),
      preferred_staff_id: staffId === "any" ? null : staffId,
    };

    const response = await fetchWithAuth("/scheduling/find-slots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return error(errorData.detail || "Không thể tải khung giờ từ hệ thống");
    }

    const result = await response.json();

    // Convert backend SlotOption to frontend TimeSlot
    const slots: TimeSlot[] = (result.available_slots || []).map(
      (opt: any) => ({
        id: `${format(new Date(opt.start_time), "yyyy-MM-dd-HH-mm")}-${opt.staff.id}`,
        date: format(new Date(opt.start_time), "yyyy-MM-dd"),
        start_time: format(new Date(opt.start_time), "HH:mm"),
        end_time: format(new Date(opt.end_time), "HH:mm"),
        staff_id: opt.staff.id,
        staff_name: opt.staff.name,
        is_available: true,
      })
    );

    return success(slots);
  } catch (err) {
    console.error("Error fetching available slots:", err);
    return error("Lỗi kết nối máy chủ lập lịch");
  }
}
