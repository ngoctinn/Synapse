"use server"

import "server-only"

import { fetchWithAuth } from "@/shared/lib/api"
import { revalidatePath } from "next/cache"
import { Skill } from "../services/types"
import { inviteStaffSchema } from "./schemas"
import { StaffListResponse, StaffUpdate } from "./types"

export type ActionState = {
  success?: boolean
  error?: string
  message?: string
}

export async function getStaffList(
  page: number = 1,
  limit: number = 10
): Promise<StaffListResponse> {
  const res = await fetchWithAuth(`/staff?page=${page}&limit=${limit}`, {
    method: "GET",
    next: { tags: ["staff"] },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch staff list")
  }

  return res.json()
}

export async function getSkills(): Promise<Skill[]> {
  const res = await fetchWithAuth("/services/skills", {
    method: "GET",
    next: { tags: ["skills"] },
  })

  if (!res.ok) {
    throw new Error("Failed to fetch skills")
  }

  return res.json()
}

export async function inviteStaff(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const rawData = {
    email: formData.get("email"),
    role: formData.get("role"),
    full_name: formData.get("full_name"),
    title: formData.get("title"),
    bio: formData.get("bio") || undefined,
  }

  // Validate with Zod
  const validatedFields = inviteStaffSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.issues[0].message,
    }
  }

  try {
    const res = await fetchWithAuth("/staff/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validatedFields.data),
    })

    if (!res.ok) {
      const errorData = await res.json()
      return { success: false, error: errorData.detail || "Không thể mời nhân viên" }
    }

    revalidatePath("/admin/staff")
    return { success: true, message: "Đã gửi lời mời thành công" }
  } catch (error) {
    return { success: false, error: "Lỗi kết nối đến server" }
  }
}

export async function deleteStaff(staffId: string): Promise<ActionState> {
  try {
    const res = await fetchWithAuth(`/staff/${staffId}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      const errorData = await res.json()
      return { success: false, error: errorData.detail || "Không thể xóa nhân viên" }
    }

    revalidatePath("/admin/staff")
    return { success: true, message: "Đã xóa nhân viên thành công" }
  } catch (error) {
    return { success: false, error: "Lỗi kết nối đến server" }
  }
}

export async function updateStaff(staffId: string, data: StaffUpdate): Promise<ActionState> {
  try {
    const res = await fetchWithAuth(`/staff/${staffId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json()
      return { success: false, error: errorData.detail || "Không thể cập nhật thông tin" }
    }

    revalidatePath("/admin/staff")
    return { success: true, message: "Cập nhật thông tin thành công" }
  } catch (error) {
    return { success: false, error: "Lỗi kết nối đến server" }
  }
}

export async function updateStaffSkills(staffId: string, skillIds: string[]): Promise<ActionState> {
  try {
    const res = await fetchWithAuth(`/staff/${staffId}/skills`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skill_ids: skillIds }),
    })

    if (!res.ok) {
      const errorData = await res.json()
      return { success: false, error: errorData.detail || "Không thể cập nhật kỹ năng" }
    }

    revalidatePath("/admin/staff")
    return { success: true, message: "Cập nhật kỹ năng thành công" }
  } catch (error) {
    return { success: false, error: "Lỗi kết nối đến server" }
  }
}

export async function updateUser(userId: string, data: { full_name?: string; phone_number?: string }): Promise<ActionState> {
  try {
    const res = await fetchWithAuth(`/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const errorData = await res.json()
      return { success: false, error: errorData.detail || "Không thể cập nhật thông tin người dùng" }
    }

    revalidatePath("/admin/staff")
    return { success: true, message: "Cập nhật thông tin thành công" }
  } catch (error) {
    return { success: false, error: "Lỗi kết nối đến server" }
  }
}
