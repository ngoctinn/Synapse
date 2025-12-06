import { BookingStaff, TimeSlot } from "./types"

export const MOCK_STAFF: BookingStaff[] = [
  {
    id: "s1",
    name: "Nguyễn Thị Lan",
    role: "Senior Therapist",
    rating: 4.9,
    avatar: "https://i.pravatar.cc/150?u=s1",
    tags: ["Kinh nghiệm 5 năm", "Massage trị liệu"]
  },
  {
    id: "s2",
    name: "Trần Văn Hùng",
    role: "Master Stylist",
    rating: 4.8,
    avatar: "https://i.pravatar.cc/150?u=s2",
    tags: ["Kỹ thuật cao", "Cắt tóc nam"]
  },
  {
    id: "s3",
    name: "Lê Thị Mai",
    role: "Therapist",
    rating: 4.7,
    avatar: "https://i.pravatar.cc/150?u=s3",
    tags: ["Chăm sóc da", "Nhẹ nhàng"]
  }
]

export const MOCK_SLOTS: TimeSlot[] = [
  { time: "09:00" },
  { time: "09:30", isHighDemand: true },
  { time: "10:00", isRecommended: true },
  { time: "10:30" },
  { time: "11:00", isRecommended: true },
  { time: "13:30" },
  { time: "14:00", isRecommended: true },
  { time: "14:30", isHighDemand: true },
  { time: "15:00" },
  { time: "16:00", isRecommended: true },
]
