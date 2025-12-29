import "server-only";

import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { fetchWithAuth } from "@/shared/lib/api";
import { cache } from "react";
import {
  StaffInvite,
  StaffListResponse,
  StaffUpdate,
} from "./model/types";

export type TechnicianOption = { id: string; name: string };

const API_ROOT = "/staff";

/**
 * Lấy danh sách nhân viên
 */
export const getStaffList = cache(async (
  page: number = 1,
  limit: number = 10,
  role?: string,
  isActive?: boolean
): Promise<ActionResponse<StaffListResponse>> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (role) params.append("role", role);
    if (isActive !== undefined) params.append("is_active", String(isActive));

    const res = await fetchWithAuth(`${API_ROOT}/?${params.toString()}`, {
      next: { tags: ["staff"] },
    });

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
});

/**
 * Lấy danh sách kỹ thuật viên (cho dropdown)
 */
export const getTechniciansApi = cache(async (): Promise<{ id: string; name: string }[]> => {
  try {
    const res = await fetchWithAuth(
      `${API_ROOT}/?role=technician&is_active=true&limit=100`,
      { next: { tags: ["staff"] } }
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
});

/**
 * Mutation APIs
 */

export async function inviteStaffApi(data: StaffInvite): Promise<ActionResponse> {
  try {
    const res = await fetchWithAuth(`${API_ROOT}/invite`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errData = await res.json();
      return error(errData.detail || "Gửi lời mời thất bại");
    }

    return success(undefined);
  } catch (e) {
    console.error("Invite error:", e);
    return error("Gửi lời mời thất bại: Lỗi hệ thống");
  }
}

export async function updateStaffApi(staffId: string, data: StaffUpdate): Promise<ActionResponse> {
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
    return success(undefined);
  } catch (e) {
    console.error("Update staff API error:", e);
    throw e;
  }
}

export async function updateStaffSkillsApi(staffId: string, skillIds: string[]): Promise<ActionResponse> {
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
    console.error("Update staff skills API error:", e);
    throw e;
  }
}

export async function deleteStaffApi(staffId: string): Promise<ActionResponse> {
  try {
    const res = await fetchWithAuth(`${API_ROOT}/${staffId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errData = await res.json();
      return error(errData.detail || "Xóa nhân viên thất bại");
    }

    return success(undefined);
  } catch (e) {
    console.error("Delete staff error:", e);
    return error("Xóa nhân viên thất bại: Lỗi hệ thống");
  }
}
