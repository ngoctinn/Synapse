"use server"

import "server-only"

import { revalidatePath } from "next/cache"
import { Skill } from "../services/types"
import { staffCreateSchema } from "./schemas"
import { Schedule, StaffListResponse, StaffUpdate } from "./types"


export async function manageStaff(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const mode = formData.get("form_mode")
  if (mode === "create") {
    return inviteStaff(prevState, formData)
  } else {
    return updateStaffAction(prevState, formData)
  }
}

export type ActionState = {
  success?: boolean
  error?: string
  message?: string
}



import { MOCK_SKILLS } from "@/features/services/data/mocks"
import { MOCK_STAFF } from "./data/mocks"
import { MOCK_SCHEDULES } from "./data/schedules"





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
    hired_at: formData.get("hired_at") || undefined,
    commission_rate: formData.get("commission_rate") ? Number(formData.get("commission_rate")) : undefined,
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


export async function updateStaffAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const staffId = formData.get("staff_id") as string
  if (!staffId) return { success: false, error: "Missing Staff ID" }

  const data = {
    full_name: formData.get("full_name"),
    phone_number: formData.get("phone_number"),
    title: formData.get("title"),
    bio: formData.get("bio"),
    color_code: formData.get("color_code"),
    role: formData.get("role"),
    skill_ids: formData.get("skill_ids") ? JSON.parse(formData.get("skill_ids") as string) : [],
  }


  await updateUser(staffId, {
    full_name: data.full_name as string,
    phone_number: data.phone_number as string,
  })


  await updateStaff(staffId, {
    title: data.title as string,
    bio: data.bio as string,
    color_code: data.color_code as string,
  })


  if (data.role === "technician") {
    await updateStaffSkills(staffId, data.skill_ids)
  }

  revalidatePath("/admin/staff")
  return { success: true, message: "Cập nhật nhân viên thành công" }
}

export async function updateUser(userId: string, data: { full_name?: string; phone_number?: string }): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  // Mock logic only
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

export async function batchUpdateSchedule(creates: Schedule[], deletes: string[]): Promise<ActionState> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  // In a real app, this would be a database transaction
  // await db.transaction(async (tx) => {
  //   if (deletes.length > 0) await tx.delete(schedules).where(inArray(schedules.id, deletes))
  //   if (creates.length > 0) await tx.insert(schedules).values(creates)
  // })

  console.log(`[Batch Update] Created ${creates.length} schedules, Deleted ${deletes.length} schedules`)

  revalidatePath("/admin/staff")
  return { success: true, message: `Đã lưu ${creates.length + deletes.length} thay đổi` }
}
