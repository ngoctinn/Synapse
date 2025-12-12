"use server"

import "server-only"

import { revalidatePath } from "next/cache"
import { Skill } from "../services/types"
import { staffCreateSchema } from "./model/schemas"
import { Schedule, StaffListResponse, StaffUpdate } from "./model/types"
import { ActionResponse, success, error } from "@/shared/lib/action-response"


export async function manageStaff(prevState: unknown, formData: FormData): Promise<ActionResponse> {
  const mode = formData.get("form_mode")
  if (mode === "create") {
    return inviteStaff(prevState, formData)
  } else {
    return updateStaffAction(prevState, formData)
  }
}

import { MOCK_SKILLS } from "@/features/services/data/mocks"
import { MOCK_STAFF } from "./model/mocks"
import { MOCK_SCHEDULES } from "./model/schedules"


export async function getStaffList(
  page: number = 1,
  limit: number = 10
): Promise<ActionResponse<StaffListResponse>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return success({
    data: MOCK_STAFF,
    total: MOCK_STAFF.length,
    page,
    limit,
  })
}

export async function getSkills(): Promise<ActionResponse<Skill[]>> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return success(MOCK_SKILLS)
}

// Lấy danh sách KTV đang hoạt động để hiển thị trong dropdown "Chuyên viên ưu tiên"
export type TechnicianOption = {
  id: string
  name: string
}

export async function getTechnicians(): Promise<TechnicianOption[]> {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return MOCK_STAFF
    .filter(staff => staff.user.role === "technician" && staff.user.is_active)
    .map(staff => ({
      id: staff.user_id,
      name: staff.user.full_name ?? "Không có tên"
    }))
}

export async function inviteStaff(prevState: unknown, formData: FormData): Promise<ActionResponse> {
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
    return error("Dữ liệu không hợp lệ", validatedFields.error.flatten().fieldErrors)
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))
  revalidatePath("/admin/staff")
  return success(undefined, "Đã gửi lời mời thành công (Mock)")
}

export async function deleteStaff(staffId: string): Promise<ActionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  revalidatePath("/admin/staff")
  return success(undefined, "Đã xóa nhân viên thành công (Mock)")
}

export async function updateStaff(staffId: string, data: StaffUpdate): Promise<ActionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  revalidatePath("/admin/staff")
  return success(undefined, "Cập nhật thông tin thành công (Mock)")
}

export async function updateStaffSkills(staffId: string, skillIds: string[]): Promise<ActionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  revalidatePath("/admin/staff")
  return success(undefined, "Cập nhật kỹ năng thành công (Mock)")
}


export async function updateStaffAction(prevState: unknown, formData: FormData): Promise<ActionResponse> {
  const staffId = formData.get("staff_id") as string
  if (!staffId) return error("Missing Staff ID")

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
  return success(undefined, "Cập nhật nhân viên thành công")
}

export async function updateUser(userId: string, data: { full_name?: string; phone_number?: string }): Promise<ActionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  // Mock logic only
  return success(undefined, "Cập nhật thông tin thành công (Mock)")
}

export async function getPermissions(): Promise<ActionResponse<Record<string, Record<string, boolean>>>> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return success({
    dashboard: { admin: true, receptionist: true, technician: true },
    staff: { admin: true, receptionist: false, technician: false },
    customers: { admin: true, receptionist: true, technician: true },
    services: { admin: true, receptionist: true, technician: false },
    inventory: { admin: true, receptionist: true, technician: true },
    reports: { admin: true, receptionist: false, technician: false },
    settings: { admin: true, receptionist: false, technician: false },
  })
}

export async function updatePermissions(permissions: Record<string, Record<string, boolean>>): Promise<ActionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return success(undefined, "Cập nhật phân quyền thành công (Mock)")
}

export async function getSchedules(startDate: string, endDate: string): Promise<ActionResponse<Schedule[]>> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return success(MOCK_SCHEDULES)
}

export async function updateSchedule(schedule: Schedule): Promise<ActionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  revalidatePath("/admin/staff")
  return success(undefined, "Cập nhật lịch làm việc thành công (Mock)")
}

export async function deleteSchedule(scheduleId: string): Promise<ActionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  revalidatePath("/admin/staff")
  return success(undefined, "Đã xóa lịch làm việc thành công (Mock)")
}

export async function batchUpdateSchedule(creates: Schedule[], deletes: string[]): Promise<ActionResponse> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  // In a real app, this would be a database transaction
  // await db.transaction(async (tx) => {
  //   if (deletes.length > 0) await tx.delete(schedules).where(inArray(schedules.id, deletes))
  //   if (creates.length > 0) await tx.insert(schedules).values(creates)
  // })

  console.log(`[Batch Update] Created ${creates.length} schedules, Deleted ${deletes.length} schedules`)

  revalidatePath("/admin/staff")
  return success(undefined, `Đã lưu ${creates.length + deletes.length} thay đổi`)
}
