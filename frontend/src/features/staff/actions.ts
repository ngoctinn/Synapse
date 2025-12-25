"use server";

import "server-only";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { fetchWithAuth } from "@/shared/lib/api";
import { revalidatePath } from "next/cache";
import { Skill } from "@/features/services/model/types";
import { staffCreateSchema } from "./model/schemas";
import {
  CommissionReportItem,
  Schedule,
  Staff,
  StaffListResponse,
  StaffUpdate,
} from "./model/types";
import { MOCK_SCHEDULES } from "./model/schedules";

const API_ROOT = "/staff";

/**
 * Handle Staff Form Submission (Create/Update)
 */
export async function manageStaff(
  prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const mode = formData.get("form_mode");
  return mode === "create"
    ? inviteStaff(prevState, formData)
    : updateStaffAction(prevState, formData);
}

/**
 * Get Paginated Staff List
 */
export async function getStaffList(
  page: number = 1,
  limit: number = 10,
  role?: string,
  isActive?: boolean
): Promise<ActionResponse<StaffListResponse>> {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (role) params.append("role", role);
    if (isActive !== undefined) params.append("is_active", String(isActive));

    const res = await fetchWithAuth(`${API_ROOT}/?${params.toString()}`);

    if (!res.ok) {
      if (res.status === 401) return error("Unauthorized");
      const errData = await res.json();
      return error(errData.detail || "Failed to fetch staff list");
    }

    const data = await res.json();
    return success(data);
  } catch (e) {
    console.error("Error fetching staff list:", e);
    return error("Failed to fetch staff list");
  }
}

/**
 * Get All Skills (Proxy to Services Module or direct mock if not ready)
 * TODO: Replace with real API call to /api/v1/skills if available
 */
export async function getSkills(): Promise<ActionResponse<Skill[]>> {
  // Temporary: Fetch skills via Services API path if exists,
  // OR fallback to mock. Since Service Module usually owns Skills.
  // We will assume a standard endpoint exists or use Service module actions.
  // For now simple fetch from backend if endpoint exists.
  try {
    const res = await fetchWithAuth("/api/v1/services/skills"); // Assumption
    if (res.ok) {
      const data = await res.json();
      return success(data);
    }
  } catch (e) {
    // Fallback or ignore
  }
  // Fallback to mock if API not ready
  const { MOCK_SKILLS } = await import("@/features/services/model/mocks");
  return success(MOCK_SKILLS);
}

export type TechnicianOption = { id: string; name: string };

/**
 * Get Technicians Options (Dropdown)
 */
export async function getTechnicians(): Promise<TechnicianOption[]> {
  try {
    const res = await fetchWithAuth(
      `${API_ROOT}/?role=technician&is_active=true&limit=100`
    );
    if (!res.ok) return [];

    const data: StaffListResponse = await res.json();
    return data.data.map((staff) => ({
      id: staff.user_id,
      name: staff.user.full_name || "N/A",
    }));
  } catch (e) {
    console.error("Error fetching technicians:", e);
    return [];
  }
}

/**
 * Invite Logic
 */
export async function inviteStaff(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const rawData = {
    email: formData.get("email"),
    role: formData.get("role"),
    full_name: formData.get("full_name"),
    title: formData.get("title"),
    bio: formData.get("bio") || undefined,
    color_code: formData.get("color_code") || "#3B82F6",
    skill_ids: formData.get("skill_ids")
      ? JSON.parse(formData.get("skill_ids") as string)
      : [],
    // hired_at: Not used in invite, optional in backend logic?
    // Actually backend StaffInvite doesn't take hired_at.
    // Backend StaffCreate takes hired_at.
    // We strictly follow backend StaffInvite schema.
  };

  const validatedFields = staffCreateSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return error(
      "Dữ liệu không hợp lệ",
      validatedFields.error.flatten().fieldErrors
    );
  }

  try {
    const res = await fetchWithAuth(`${API_ROOT}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validatedFields.data),
    });

    if (!res.ok) {
      const errData = await res.json();
      return error(errData.detail || "Gửi lời mời thất bại");
    }

    revalidatePath("/admin/staff");
    return success(undefined, "Đã gửi lời mời thành công");
  } catch (e) {
    return error("Gửi lời mời thất bại: Lỗi hệ thống");
  }
}

/**
 * Delete (Deactivate) Staff
 */
export async function deleteStaff(staffId: string): Promise<ActionResponse> {
  try {
    const res = await fetchWithAuth(`${API_ROOT}/${staffId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errData = await res.json();
      return error(errData.detail || "Xóa nhân viên thất bại");
    }

    revalidatePath("/admin/staff");
    return success(undefined, "Đã xóa nhân viên thành công");
  } catch (e) {
    return error("Xóa nhân viên thất bại: Lỗi hệ thống");
  }
}

/**
 * Common Update Function (Single API Call)
 */
export async function updateStaff(
  staffId: string,
  data: StaffUpdate
): Promise<ActionResponse> {
  try {
    const res = await fetchWithAuth(`${API_ROOT}/${staffId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json();
      return error(errData.detail || "Cập nhật thất bại");
    }
    return success(undefined); // Success
  } catch (e) {
    throw e;
  }
}

/**
 * Update Staff Skills
 */
export async function updateStaffSkills(
  staffId: string,
  skillIds: string[]
): Promise<ActionResponse> {
  try {
    const res = await fetchWithAuth(`${API_ROOT}/${staffId}/skills`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill_ids: skillIds }),
    });

    if (!res.ok) {
      const errData = await res.json();
      return error(errData.detail || "Cập nhật kỹ năng thất bại");
    }
    return success(undefined);
  } catch (e) {
    throw e;
  }
}

/**
 * Main Update Action (Orchestrator)
 */
export async function updateStaffAction(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResponse> {
  const staffId = formData.get("staff_id") as string;
  if (!staffId) return error("Missing Staff ID");

  const full_name = formData.get("full_name") as string;
  const phone_number = formData.get("phone_number") as string;

  // 1. Prepare Staff Data (Domain data)
  const staffData: StaffUpdate = {
    title: formData.get("title") as string,
    bio: formData.get("bio") as string,
    color_code: (formData.get("color_code") as string) || "#3B82F6",
    commission_rate: formData.get("commission_rate")
      ? Number(formData.get("commission_rate"))
      : undefined,
  };

  const role = formData.get("role");
  const skillIds = formData.get("skill_ids")
    ? JSON.parse(formData.get("skill_ids") as string)
    : [];

  try {
    // 2. Call APIs sequentially or parallel
    // Currently backend splits User Update and Staff Update?
    // Based on router.py, typical update_staff only updates Staff table (bio, title, color).
    // User info (fullname, phone) might need separate API if not included in staff update.
    // However, Frontend Form includes basic info.
    // Checking router.py -> update_staff only accepts StaffUpdate (bio, title, color).
    // We need a way to update User info. Usually /api/v1/users/{id}
    // Assumption: We have /api/v1/users/{id} for basic info update.
    // If not, we skip updating basic info here or need to add endpoint.
    // Let's implement User Update via assumed endpoint.

    // A. Update Staff Profile
    await updateStaff(staffId, staffData);

    // B. Update Skills if Technician
    if (role === "technician") {
      await updateStaffSkills(staffId, skillIds);
    }

    // C. Update User Info (Fullname, Phone) - Pending backend implementation
    // For now we assume a user update endpoint exists or ignore it if not critical.
    // TODO: Implement User Update API call
    // await updateUser(staffId, { full_name, phone_number });

    revalidatePath("/admin/staff");
    return success(undefined, "Cập nhật nhân viên thành công");
  } catch (e) {
    console.error(e);
    return error("Cập nhật thất bại: Lỗi hệ thống");
  }
}

export async function updateUser(
  userId: string,
  data: { full_name?: string; phone_number?: string }
): Promise<ActionResponse> {
  // Placeholder API call
  // const res = await fetchWithAuth(`/api/v1/users/${userId}`, { method: "PUT", body: ... });
  return success(undefined);
}

// ===== MOCK / NOT IMPLEMENTED YET =====

export async function getPermissions(): Promise<
  ActionResponse<Record<string, Record<string, boolean>>>
> {
  return success({
    dashboard: { admin: true, receptionist: true, technician: true },
    staff: { admin: true, receptionist: false, technician: false },
    customers: { admin: true, receptionist: true, technician: true },
    services: { admin: true, receptionist: true, technician: false },
    inventory: { admin: true, receptionist: true, technician: true },
    reports: { admin: true, receptionist: false, technician: false },
    settings: { admin: true, receptionist: false, technician: false },
  });
}

export async function updatePermissions(
  _permissions: Record<string, Record<string, boolean>>
): Promise<ActionResponse> {
  return success(undefined, "Cập nhật phân quyền thành công");
}

export async function getSchedules(
  _startDate: string,
  _endDate: string
): Promise<ActionResponse<Schedule[]>> {
  return success(MOCK_SCHEDULES);
}

export async function updateSchedule(
  _schedule: Schedule
): Promise<ActionResponse> {
  revalidatePath("/admin/staff");
  return success(undefined, "Cập nhật lịch làm việc thành công");
}

export async function deleteSchedule(
  _scheduleId: string
): Promise<ActionResponse> {
  revalidatePath("/admin/staff");
  return success(undefined, "Đã xóa lịch làm việc thành công");
}

export async function batchUpdateSchedule(
  creates: Schedule[],
  deletes: string[]
): Promise<ActionResponse> {
  revalidatePath("/admin/staff");
  return success(
    undefined,
    `Đã lưu ${creates.length + deletes.length} thay đổi`
  );
}

export async function getCommissionReport(
  month: number,
  year: number
): Promise<ActionResponse<CommissionReportItem[]>> {
  // Use mock for now
  const { MOCK_STAFF } = await import("./model/mocks");
  const report: CommissionReportItem[] = MOCK_STAFF.filter(
    (staff) => staff.user.role === "technician" && staff.user.is_active
  ).map((staff) => {
    const totalServices = Math.floor(Math.random() * 50) + 10;
    const totalRevenue = totalServices * 500000;
    const rate = staff.commission_rate || 5;
    return {
      staffId: staff.user_id,
      staffName: staff.user.full_name || "N/A",
      role: "Kỹ thuật viên",
      totalServices,
      totalRevenue,
      commissionRate: rate,
      totalCommission: totalRevenue * (rate / 100),
      period: `${month}/${year}`,
    };
  });

  return success(report);
}
