"use server"

import "server-only"

import { revalidatePath } from "next/cache"
import { Skill } from "../services/types"
import { inviteStaffSchema } from "./schemas"
import { Schedule, StaffListResponse, StaffUpdate } from "./types"

export type ActionState = {
  success?: boolean
  error?: string
  message?: string
}

// --- MOCK DATA GENERATORS ---

const MOCK_SKILLS: Skill[] = [
  { id: "1", name: "Massage Thụy Điển", description: "", code: "S001" },
  { id: "2", name: "Chăm sóc da mặt", description: "", code: "S002" },
  { id: "3", name: "Gội đầu dưỡng sinh", description: "", code: "S003" },
  { id: "4", name: "Massage Thái", description: "", code: "S004" },
]

const MOCK_STAFF_LIST: any[] = [
  {
    user_id: "staff_1",
    hired_at: "2023-01-15",
    created_at: "2023-01-10",
    bio: "Chuyên gia massage với 5 năm kinh nghiệm.",
    title: "Senior Therapist",
    color_code: "#3b82f6",
    commission_rate: 10,
    user: {
      id: "staff_1",
      email: "ngoctin@synapse.com",
      full_name: "Ngọc Tín",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
      phone_number: "0901234567",
      role: "technician",
      is_active: true,
    },
    skills: [MOCK_SKILLS[0], MOCK_SKILLS[3]],
  },
  {
    user_id: "staff_2",
    hired_at: "2023-03-20",
    created_at: "2023-03-18",
    bio: "Kỹ thuật viên chăm sóc da chuyên nghiệp.",
    title: "Skin Care Specialist",
    color_code: "#ec4899",
    commission_rate: 8,
    user: {
      id: "staff_2",
      email: "lananh@synapse.com",
      full_name: "Lan Anh",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
      phone_number: "0909876543",
      role: "technician",
      is_active: true,
    },
    skills: [MOCK_SKILLS[1]],
  },
  {
    user_id: "staff_3",
    hired_at: "2023-06-01",
    created_at: "2023-05-28",
    bio: "Quản lý lễ tân, thân thiện và chu đáo.",
    title: "Receptionist",
    color_code: "#10b981",
    commission_rate: 5,
    user: {
      id: "staff_3",
      email: "minhthu@synapse.com",
      full_name: "Minh Thư",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Minh",
      phone_number: "0912345678",
      role: "receptionist",
      is_active: true,
    },
    skills: [],
  },
  {
    user_id: "staff_4",
    hired_at: "2023-07-10",
    created_at: "2023-07-05",
    bio: "Kỹ thuật viên nail art sáng tạo.",
    title: "Nail Artist",
    color_code: "#f59e0b",
    commission_rate: 12,
    user: {
      id: "staff_4",
      email: "thuychi@synapse.com",
      full_name: "Thùy Chi",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chi",
      phone_number: "0987654321",
      role: "technician",
      is_active: true,
    },
    skills: [MOCK_SKILLS[1], MOCK_SKILLS[2]],
  },
  {
    user_id: "staff_5",
    hired_at: "2023-08-15",
    created_at: "2023-08-10",
    bio: "Quản lý spa với 10 năm kinh nghiệm.",
    title: "Spa Manager",
    color_code: "#8b5cf6",
    commission_rate: 15,
    user: {
      id: "staff_5",
      email: "hoanganh@synapse.com",
      full_name: "Hoàng Anh",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoang",
      phone_number: "0918273645",
      role: "admin",
      is_active: true,
    },
    skills: [],
  },
  {
    user_id: "staff_6",
    hired_at: "2023-09-01",
    created_at: "2023-08-25",
    bio: "Chuyên viên tư vấn khách hàng.",
    title: "Consultant",
    color_code: "#ef4444",
    commission_rate: 7,
    user: {
      id: "staff_6",
      email: "mylinh@synapse.com",
      full_name: "Mỹ Linh",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Linh",
      phone_number: "0923456789",
      role: "receptionist",
      is_active: true,
    },
    skills: [],
  },
  {
    user_id: "staff_7",
    hired_at: "2023-10-05",
    created_at: "2023-10-01",
    bio: "Kỹ thuật viên massage trị liệu.",
    title: "Therapist",
    color_code: "#06b6d4",
    commission_rate: 10,
    user: {
      id: "staff_7",
      email: "quanghuy@synapse.com",
      full_name: "Quang Huy",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Huy",
      phone_number: "0934567890",
      role: "technician",
      is_active: true,
    },
    skills: [MOCK_SKILLS[0], MOCK_SKILLS[3]],
  },
  {
    user_id: "staff_8",
    hired_at: "2023-11-20",
    created_at: "2023-11-15",
    bio: "Học việc, đang đào tạo nâng cao.",
    title: "Trainee",
    color_code: "#64748b",
    commission_rate: 0,
    user: {
      id: "staff_8",
      email: "ducminh@synapse.com",
      full_name: "Đức Minh",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=MinhD",
      phone_number: "0945678901",
      role: "technician",
      is_active: false,
    },
    skills: [MOCK_SKILLS[2]],
  },
  {
    user_id: "staff_9",
    hired_at: "2023-12-01",
    created_at: "2023-11-28",
    bio: "Chuyên gia trang điểm.",
    title: "Makeup Artist",
    color_code: "#d946ef",
    commission_rate: 12,
    user: {
      id: "staff_9",
      email: "thanhhang@synapse.com",
      full_name: "Thanh Hằng",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hang",
      phone_number: "0956789012",
      role: "technician",
      is_active: true,
    },
    skills: [MOCK_SKILLS[1]],
  },
  {
    user_id: "staff_10",
    hired_at: "2024-01-10",
    created_at: "2024-01-05",
    bio: "Kỹ thuật viên spa đa năng.",
    title: "Senior Therapist",
    color_code: "#84cc16",
    commission_rate: 11,
    user: {
      id: "staff_10",
      email: "bichngoc@synapse.com",
      full_name: "Bích Ngọc",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ngoc",
      phone_number: "0967890123",
      role: "technician",
      is_active: true,
    },
    skills: [MOCK_SKILLS[0], MOCK_SKILLS[1], MOCK_SKILLS[2]],
  },
  {
    user_id: "staff_11",
    hired_at: "2024-02-15",
    created_at: "2024-02-10",
    bio: "Lễ tân ca tối.",
    title: "Receptionist",
    color_code: "#f43f5e",
    commission_rate: 5,
    user: {
      id: "staff_11",
      email: "tuananh@synapse.com",
      full_name: "Tuấn Anh",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tuan",
      phone_number: "0978901234",
      role: "receptionist",
      is_active: true,
    },
    skills: [],
  },
  {
    user_id: "staff_12",
    hired_at: "2024-03-01",
    created_at: "2024-02-25",
    bio: "Kỹ thuật viên gội đầu.",
    title: "Junior Therapist",
    color_code: "#0ea5e9",
    commission_rate: 8,
    user: {
      id: "staff_12",
      email: "kimlien@synapse.com",
      full_name: "Kim Liên",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lien",
      phone_number: "0989012345",
      role: "technician",
      is_active: true,
    },
    skills: [MOCK_SKILLS[2]],
  },

]

// --- ACTIONS ---

export async function getStaffList(
  page: number = 1,
  limit: number = 10
): Promise<StaffListResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return {
    data: MOCK_STAFF_LIST,
    total: MOCK_STAFF_LIST.length,
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
    skill_ids: formData.get("skill_ids") ? JSON.parse(formData.get("skill_ids") as string) : undefined,
  }

  const validatedFields = inviteStaffSchema.safeParse(rawData)

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
  return [
    {
      id: "1",
      staffId: "staff_1",
      date: startDate,
      shiftId: "shift_morning",
      status: "PUBLISHED",
    },
    {
      id: "2",
      staffId: "staff_1",
      date: endDate,
      shiftId: "shift_afternoon",
      status: "PUBLISHED",
    },
    {
      id: "3",
      staffId: "staff_2",
      date: startDate,
      shiftId: "shift_full",
      status: "PUBLISHED",
    }
  ]
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
