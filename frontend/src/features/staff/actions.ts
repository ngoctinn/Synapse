"use server";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidateTag } from "next/cache";
import { getSkills as getServicesSkills } from "@/features/services/services.api";
import { staffCreateSchema } from "./model/schemas";
import {
  CommissionReportItem,
  Schedule,
  StaffUpdate,
} from "./model/types";
import { MOCK_SCHEDULES } from "./model/schedules";
import {
  deleteStaffApi,
  getStaffList as getStaffListApi,
  getTechniciansApi,
  inviteStaffApi,
  updateStaffApi as updateStaffApiCall,
  updateStaffSkillsApi,
} from "./staff.api";

export type { TechnicianOption } from "./staff.api";

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
 * Get Staff List (Server Action wrapper for Client Components or compatibility)
 */
export async function getStaffList(
  page: number = 1,
  limit: number = 10,
  role?: string,
  isActive?: boolean
) {
  return getStaffListApi(page, limit, role, isActive);
}

/**
 * Get All Skills (Delegated to Services)
 */
export async function getSkills() {
  return getServicesSkills();
}

/**
 * Get Technicians (Server Action for Client Components)
 */
export async function getTechnicians() {
  return getTechniciansApi();
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
  };

  const validatedFields = staffCreateSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return error(
      "Dữ liệu không hợp lệ",
      validatedFields.error.flatten().fieldErrors
    );
  }

  const result = await inviteStaffApi(validatedFields.data);
  if (result.status === "success") {
    revalidateTag("staff", "max");
  }
  return result;
}

/**
 * Delete (Deactivate) Staff
 */
export async function deleteStaff(staffId: string): Promise<ActionResponse> {
  const result = await deleteStaffApi(staffId);
  if (result.status === "success") {
    revalidateTag("staff", "max");
  }
  return result;
}

/**
 * Update Staff (Exported for direct use in components)
 */
export async function updateStaff(
  staffId: string,
  data: StaffUpdate
): Promise<ActionResponse> {
  const result = await updateStaffApiCall(staffId, data);
  if (result.status === "success") {
    revalidateTag("staff", "max");
  }
  return result;
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
    await updateStaff(staffId, staffData);

    if (role === "technician") {
      await updateStaffSkillsApi(staffId, skillIds);
    }

    revalidateTag("staff", "max");
    return success(undefined, "Cập nhật nhân viên thành công");
  } catch (e) {
    console.error("Update staff action error:", e);
    return error("Cập nhật thất bại: Lỗi hệ thống");
  }
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
  revalidateTag("staff", "max");
  return success(undefined, "Cập nhật lịch làm việc thành công");
}

export async function deleteSchedule(
  _scheduleId: string
): Promise<ActionResponse> {
  revalidateTag("staff", "max");
  return success(undefined, "Đã xóa lịch làm việc thành công");
}

export async function batchUpdateSchedule(
  creates: Schedule[],
  deletes: string[]
): Promise<ActionResponse> {
  revalidateTag("staff", "max");
  return success(
    undefined,
    `Đã lưu ${creates.length + deletes.length} thay đổi`
  );
}

export async function getCommissionReport(
  month: number,
  year: number
): Promise<ActionResponse<CommissionReportItem[]>> {
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
