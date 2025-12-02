"use server"

import "server-only"

import { Skill } from "@/features/services/types"
import { revalidatePath } from "next/cache"
import { MOCK_SKILLS, MOCK_STAFF } from "./data/mock-staff"
import { inviteStaffSchema } from "./schemas"
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

  const rawData = {
    email: formData.get("email"),
    role: formData.get("role"),
  }

  // Validate with Zod
  const validatedFields = inviteStaffSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.issues[0].message,
    }
  }

  const { email } = validatedFields.data

  // Simulate validation or error
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

  // In a real app, we would validate 'data' against a schema here
  // const validatedData = staffFormSchema.partial().safeParse(data)

  revalidatePath("/admin/staff")
  return { success: true, message: "Cập nhật thông tin thành công" }
}
