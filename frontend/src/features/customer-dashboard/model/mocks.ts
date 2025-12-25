import { Appointment, TimeSlot, Treatment, UserProfile } from "./types";

export const MOCK_USER: UserProfile = {
  id: "user-123",
  fullName: "Nguyễn Văn A",
  email: "nguyenvana@example.com",
  phone: "0901234567",
  avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Felix",
  membershipTier: "GOLD",
  loyaltyPoints: 1250,
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "appt-1",
    serviceName: "Chăm sóc da mặt chuyên sâu",
    startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    durationMinutes: 60,
    status: "CONFIRMED",
    location: "Giường 201 - Chi nhánh Quận 1",
    technicianName: "Trần Thị B",
  },
  {
    id: "appt-2",
    serviceName: "Massage Body đã thông kinh lạc",
    startTime: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    durationMinutes: 90,
    status: "COMPLETED",
    location: "Giường 102 - Chi nhánh Quận 1",
    technicianName: "Lê Văn C",
  },
  {
    id: "appt-3",
    serviceName: "Gội đầu dưỡng sinh",
    startTime: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days later
    durationMinutes: 45,
    status: "PENDING",
    location: "Giường 301 - Chi nhánh Quận 1",
  },
];

export const MOCK_TREATMENTS: Treatment[] = [
  {
    id: "treat-1",
    packageName: "Liệu trình Trị mụn 10 buổi",
    totalSessions: 10,
    usedSessions: 4,
    status: "ACTIVE",
    purchaseDate: "2023-10-15T00:00:00Z",
    expiryDate: "2024-10-15T00:00:00Z",
  },
  {
    id: "treat-2",
    packageName: "Gói Massage Body 5 buổi",
    totalSessions: 5,
    usedSessions: 5,
    status: "COMPLETED",
    purchaseDate: "2023-08-01T00:00:00Z",
  },
];

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
];
