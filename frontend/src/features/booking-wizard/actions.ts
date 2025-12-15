"use server";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { addHours, format } from "date-fns";
import { getServices } from "../services/actions";
import { getStaffList } from "../staff/actions";
import { ServiceItem, StaffItem, TimeSlot } from "./types";

// ... (getServicesForBooking and getAvailableStaff remain unchanged)

export async function getServicesForBooking(): Promise<ActionResponse<Record<string, ServiceItem[]>>> {
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
      const category = service.category || "Khác";

      if (!groupedServices[category]) {
        groupedServices[category] = [];
      }

      groupedServices[category].push({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category_id: service.category, // Using category name as ID for now since simple string
        image_url: service.image_url,
      });
    });

    return success(groupedServices);
  } catch (err) {
    console.error("Error fetching booking services:", err);
    return error("Failed to load services");
  }
}

export async function getAvailableStaff(params: {
  serviceIds: string[];
  date?: Date;
}): Promise<ActionResponse<StaffItem[]>> {
  try {
    const { serviceIds } = params;

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
    const { staffId, date } = params;

    // Generate mock slots directly here instead of calling an API route
    // This avoids issues with NEXT_PUBLIC_BASE_URL or server-side fetch calls
    const mockSlots = generateMockTimeSlots(date, staffId);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return success(mockSlots);
  } catch (err) {
    console.error("Error fetching available slots:", err);
    return error("Failed to fetch available slots");
  }
}

// Helper function to generate mock time slots (moved from API route)
function generateMockTimeSlots(baseDate: Date, staffId: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startHour = 9; // 9 AM
  const endHour = 17; // 5 PM (not inclusive)
  const intervalMinutes = 30;

  // Ensure we're working with the start of the day for the given date
  const startOfDay = new Date(baseDate);
  startOfDay.setHours(0, 0, 0, 0);

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const slotTime = addHours(startOfDay, hour);
      slotTime.setMinutes(minute);

      const isBooked = Math.random() > 0.8; // 20% chance of being booked

      slots.push({
        id: `${format(slotTime, 'yyyy-MM-dd-HH-mm')}-${staffId}`,
        date: format(slotTime, 'yyyy-MM-dd'),
        start_time: format(slotTime, 'HH:mm'),
        end_time: format(addHours(slotTime, 0.5), 'HH:mm'), // 30 min duration mock
        staff_id: staffId,
        is_available: !isBooked,
      });
    }
  }
  return slots;
}

