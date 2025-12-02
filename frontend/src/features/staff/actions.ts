"use server"

import { Skill } from "@/features/services/types"
import { revalidatePath } from "next/cache"
import { MOCK_SKILLS, MOCK_STAFF } from "./data/mock-staff"
import { Staff } from "./types"

// Mock delay to simulate network request
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function getStaffList(
  page: number = 1,
  limit: number = 10
): Promise<{ data: Staff[]; total: number }> {
  await delay(500)
  
  const start = (page - 1) * limit
  const end = start + limit
  const paginatedData = MOCK_STAFF.slice(start, end)
  
  return {
    data: paginatedData,
    total: MOCK_STAFF.length
  }
}

export async function getSkills(): Promise<Skill[]> {
  await delay(500)
  return MOCK_SKILLS
}

export type ActionState = {
  success?: boolean
  error?: string
  message?: string
}

export async function inviteStaff(prevState: ActionState, formData: FormData): Promise<ActionState> {
  await delay(1000)

  // Simulate validation or error
  const email = formData.get("email") as string
  if (email === "error@example.com") {
    return { success: false, error: "Email này đã tồn tại trong hệ thống" }
  }

  revalidatePath("/admin/staff")
  return { success: true, message: "Đã gửi lời mời thành công" }
}

export async function deleteStaff(staffId: string): Promise<ActionState> {
  await delay(800)

  // Simulate error
  if (staffId === "error-id") {
    return { success: false, error: "Không thể xóa nhân viên này" }
  }

  revalidatePath("/admin/staff")
  return { success: true, message: "Đã xóa nhân viên thành công" }
}

export async function updateStaff(staffId: string, data: Partial<Staff>): Promise<ActionState> {
  await delay(800)
  revalidatePath("/admin/staff")
  return { success: true, message: "Cập nhật thông tin thành công" }
}
