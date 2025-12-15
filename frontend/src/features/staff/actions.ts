"use server"

import "server-only"

import { MOCK_SKILLS } from "@/features/services/data/mocks"
import { ActionResponse, error, success } from "@/shared/lib/action-response"
import { revalidatePath } from "next/cache"
import { Skill } from "../services/types"
import { MOCK_STAFF } from "./model/mocks"
import { MOCK_SCHEDULES } from "./model/schedules"
import { staffCreateSchema } from "./model/schemas"
import { Schedule, StaffListResponse, StaffUpdate } from "./model/types"

export async function manageStaff(prevState: unknown, formData: FormData): Promise<ActionResponse> {
  const mode = formData.get("form_mode")
  return mode === "create" ? inviteStaff(prevState, formData) : updateStaffAction(prevState, formData)
}

export async function getStaffList(page: number = 1, limit: number = 10): Promise<ActionResponse<StaffListResponse>> {
  return success({
    data: MOCK_STAFF,
    total: MOCK_STAFF.length,
    page,
    limit,
  })
}

export async function getSkills(): Promise<ActionResponse<Skill[]>> {
  return success(MOCK_SKILLS)
}

export type TechnicianOption = { id: string; name: string }

export async function getTechnicians(): Promise<TechnicianOption[]> {
  return MOCK_STAFF
    .filter(staff => staff.user.role === "technician" && staff.user.is_active)
    .map(staff => ({ id: staff.user_id, name: staff.user.full_name ?? "Không có tên" }))
}

export async function inviteStaff(_prevState: unknown, formData: FormData): Promise<ActionResponse> {
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

  revalidatePath("/admin/staff")
  return success(undefined, "Đã gửi lời mời thành công")
}

export async function deleteStaff(_staffId: string): Promise<ActionResponse> {
  revalidatePath("/admin/staff")
  return success(undefined, "Đã xóa nhân viên thành công")
}

export async function updateStaff(_staffId: string, _data: StaffUpdate): Promise<ActionResponse> {
  revalidatePath("/admin/staff")
  return success(undefined, "Cập nhật thông tin thành công")
}

export async function updateStaffSkills(_staffId: string, _skillIds: string[]): Promise<ActionResponse> {
  revalidatePath("/admin/staff")
  return success(undefined, "Cập nhật kỹ năng thành công")
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

  await updateUser(staffId, { full_name: data.full_name as string, phone_number: data.phone_number as string })
  await updateStaff(staffId, { title: data.title as string, bio: data.bio as string, color_code: data.color_code as string })

  if (data.role === "technician") {
    await updateStaffSkills(staffId, data.skill_ids)
  }

  revalidatePath("/admin/staff")
  return success(undefined, "Cập nhật nhân viên thành công")
}

export async function updateUser(_userId: string, _data: { full_name?: string; phone_number?: string }): Promise<ActionResponse> {
  return success(undefined, "Cập nhật thông tin thành công")
}

export async function getPermissions(): Promise<ActionResponse<Record<string, Record<string, boolean>>>> {
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

export async function updatePermissions(_permissions: Record<string, Record<string, boolean>>): Promise<ActionResponse> {
  return success(undefined, "Cập nhật phân quyền thành công")
}

export async function getSchedules(_startDate: string, _endDate: string): Promise<ActionResponse<Schedule[]>> {
  return success(MOCK_SCHEDULES)
}

export async function updateSchedule(_schedule: Schedule): Promise<ActionResponse> {
  revalidatePath("/admin/staff")
  return success(undefined, "Cập nhật lịch làm việc thành công")
}

export async function deleteSchedule(_scheduleId: string): Promise<ActionResponse> {
  revalidatePath("/admin/staff")
  return success(undefined, "Đã xóa lịch làm việc thành công")
}

export async function batchUpdateSchedule(creates: Schedule[], deletes: string[]): Promise<ActionResponse> {
  console.log(`[Batch Update] Created ${creates.length} schedules, Deleted ${deletes.length} schedules`)
  revalidatePath("/admin/staff")
  return success(undefined, `Đã lưu ${creates.length + deletes.length} thay đổi`)
}
