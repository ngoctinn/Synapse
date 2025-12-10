import { Customer } from "../types"

export const MOCK_CUSTOMERS: Customer[] = [
  {
    user_id: "user-1",
    user: {
      id: "user-1",
      full_name: "Phạm Thị Hoa",
      email: "hoa.pham@example.com",
      phone_number: "0912345678",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hoa",
      is_active: true,
      created_at: "2024-01-15T08:00:00Z"
    },
    loyalty_points: 150,
    membership_tier: "SILVER",
    gender: "FEMALE",
    date_of_birth: "1990-05-20",
    address: "123 Nguyễn Huệ, Q1, TP.HCM",
    allergies: "Dị ứng phấn hoa",
    medical_notes: "Da nhạy cảm, dễ kích ứng với mỹ phẩm chứa cồn",
    preferred_staff_id: null
  },
  {
    user_id: "user-2",
    user: {
      id: "user-2",
      full_name: "Trần Minh Tuấn",
      email: "tuan.tran@example.com",
      phone_number: "0987654321",
      avatar_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tuan",
      is_active: true,
      created_at: "2024-02-10T10:30:00Z"
    },
    loyalty_points: 520,
    membership_tier: "GOLD",
    gender: "MALE",
    date_of_birth: "1985-12-15",
    address: "45 Lê Lợi, Q1, TP.HCM",
    allergies: null,
    medical_notes: "Thường xuyên đau mỏi vai gáy",
    preferred_staff_id: "staff-1"
  },
  {
      user_id: "user-3",
      user: {
        id: "user-3",
        full_name: "Lê Thu Thảo",
        email: "thao.le@gmail.com",
        phone_number: "0901234567",
        avatar_url: null,
        is_active: true,
        created_at: "2024-03-05T14:15:00Z"
      },
      loyalty_points: 1200,
      membership_tier: "PLATINUM",
      gender: "FEMALE",
      date_of_birth: "1995-08-08",
      address: "Biệt thự Lan Anh, Q2",
      allergies: "Hải sản",
      medical_notes: "Đang mang thai tuần thứ 12",
      preferred_staff_id: "staff-2"
    }
]
