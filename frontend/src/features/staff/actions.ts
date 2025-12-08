"use server"

import "server-only"

import { revalidatePath } from "next/cache"
import { Skill } from "../services/types"
import { staffCreateSchema } from "./schemas"
import { Schedule, StaffListResponse, StaffUpdate } from "./types"

export type ActionState = {
  success?: boolean
  error?: string
  message?: string
}

// --- MOCK DATA GENERATORS ---

import { MOCK_SKILLS } from "@/features/services/data/mocks"
import { MOCK_STAFF } from "./data/mocks"
import { MOCK_SCHEDULES } from "./data/schedules"



// --- ACTIONS ---

export async function getStaffList(
  page: number = 1,
  limit: number = 10
): Promise<StaffListResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    data: MOCK_STAFF,
    total: MOCK_STAFF.length,
    page,
    limit,
  }
}

export async function getSkills(): Promise<Skill[]> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return MOCK_SKILLS
}

export async function inviteStaff(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const rawData = {
    email: formData.get("email"),
    role: formData.get("role"),
    full_name: formData.get("full_name"),
    title: formData.get("title"),
    bio: formData.get("bio") || undefined,
    color_code: formData.get("color_code") || undefined,
    skill_ids: formData.get("skill_ids") ? JSON.parse(formData.get("skill_ids") as string) : undefined,
  }

  const validatedFields = staffCreateSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.issues[0].message,
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))
  revalidatePath("/admin/staff")
  return { success: true, message: "Đã gửi lời mời thành công (Mock)" }
}

export async function deleteStaff(staffId: string): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  revalidatePath("/admin/staff")
  return { success: true, message: "Đã xóa nhân viên thành công (Mock)" }
}

export async function updateStaff(staffId: string, data: StaffUpdate): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  revalidatePath("/admin/staff")
  return { success: true, message: "Cập nhật thông tin thành công (Mock)" }
}

export async function updateStaffSkills(staffId: string, skillIds: string[]): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  revalidatePath("/admin/staff")
  return { success: true, message: "Cập nhật kỹ năng thành công (Mock)" }
}

export async function updateUser(userId: string, data: { full_name?: string; phone_number?: string }): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  revalidatePath("/admin/staff")
  return { success: true, message: "Cập nhật thông tin thành công (Mock)" }
}

export async function getPermissions(): Promise<Record<string, Record<string, boolean>>> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return {
    dashboard: { admin: true, receptionist: true, technician: true },
    staff: { admin: true, receptionist: false, technician: false },
    customers: { admin: true, receptionist: true, technician: true },
    services: { admin: true, receptionist: true, technician: false },
    inventory: { admin: true, receptionist: true, technician: true },
    reports: { admin: true, receptionist: false, technician: false },
    settings: { admin: true, receptionist: false, technician: false },
  }
}

export async function updatePermissions(permissions: Record<string, Record<string, boolean>>): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true, message: "Cập nhật phân quyền thành công (Mock)" }
}

export async function getSchedules(startDate: string, endDate: string): Promise<Schedule[]> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return MOCK_SCHEDULES
}

export async function updateSchedule(schedule: Schedule): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  revalidatePath("/admin/staff")
  return { success: true, message: "Cập nhật lịch làm việc thành công (Mock)" }
}

export async function deleteSchedule(scheduleId: string): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  revalidatePath("/admin/staff")
  return { success: true, message: "Đã xóa lịch làm việc thành công (Mock)" }
}
