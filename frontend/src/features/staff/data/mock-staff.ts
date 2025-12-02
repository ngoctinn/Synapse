import { Staff } from "../types";

export const MOCK_STAFF: Staff[] = [
  {
    id: "1",
    name: "Nguyễn Văn Quản Lý",
    email: "admin@synapse.com",
    role: "ADMIN",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=admin",
    skills: [],
    isActive: true,
    phone: "0901234567",
    address: "123 Quận 1, TP.HCM",
  },
  {
    id: "2",
    name: "Trần Thị Lễ Tân 1",
    email: "letan1@synapse.com",
    role: "RECEPTIONIST",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=letan1",
    skills: [],
    isActive: true,
    phone: "0901234568",
    address: "456 Quận 3, TP.HCM",
  },
  {
    id: "3",
    name: "Lê Thị Lễ Tân 2",
    email: "letan2@synapse.com",
    role: "RECEPTIONIST",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=letan2",
    skills: [],
    isActive: true,
    phone: "0901234569",
    address: "789 Quận 5, TP.HCM",
  },
  {
    id: "4",
    name: "Phạm Văn Kỹ Thuật 1",
    email: "ktv1@synapse.com",
    role: "TECHNICIAN",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv1",
    skills: [
      { id: "s1", name: "Facial", code: "FACIAL" },
      { id: "s2", name: "Massage Body", code: "BODY" },
      { id: "s3", name: "Nặn mụn", code: "ACNE" }
    ],
    isActive: true,
    phone: "0901234570",
    address: "101 Quận 7, TP.HCM",
  },
  {
    id: "5",
    name: "Hoàng Thị Kỹ Thuật 2",
    email: "ktv2@synapse.com",
    role: "TECHNICIAN",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv2",
    skills: [
      { id: "s4", name: "Gội đầu", code: "SHAMPOO" },
      { id: "s5", name: "Massage Cổ Vai Gáy", code: "NECK" }
    ],
    isActive: true,
    phone: "0901234571",
    address: "202 Quận 10, TP.HCM",
  },
  {
    id: "6",
    name: "Vũ Văn Kỹ Thuật 3",
    email: "ktv3@synapse.com",
    role: "TECHNICIAN",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv3",
    skills: [
      { id: "s1", name: "Facial", code: "FACIAL" },
      { id: "s6", name: "Laser", code: "LASER" }
    ],
    isActive: true,
    phone: "0901234572",
    address: "303 Quận Bình Thạnh, TP.HCM",
  },
  {
    id: "7",
    name: "Đặng Thị Kỹ Thuật 4",
    email: "ktv4@synapse.com",
    role: "TECHNICIAN",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv4",
    skills: [
      { id: "s2", name: "Massage Body", code: "BODY" },
      { id: "s7", name: "Tắm trắng", code: "WHITENING" }
    ],
    isActive: false,
    phone: "0901234573",
    address: "404 Quận Phú Nhuận, TP.HCM",
  },
  {
    id: "8",
    name: "Bùi Văn Kỹ Thuật 5",
    email: "ktv5@synapse.com",
    role: "TECHNICIAN",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv5",
    skills: [
      { id: "s3", name: "Nặn mụn", code: "ACNE" },
      { id: "s8", name: "Peel da", code: "PEEL" }
    ],
    isActive: true,
    phone: "0901234574",
    address: "505 Quận Tân Bình, TP.HCM",
  },
  {
    id: "9",
    name: "Ngô Thị Kỹ Thuật 6",
    email: "ktv6@synapse.com",
    role: "TECHNICIAN",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv6",
    skills: [
      { id: "s9", name: "Triệt lông", code: "HAIR_REMOVAL" },
      { id: "s1", name: "Facial", code: "FACIAL" }
    ],
    isActive: true,
    phone: "0901234575",
    address: "606 Quận Gò Vấp, TP.HCM",
  },
  {
    id: "10",
    name: "Đỗ Văn Kỹ Thuật 7",
    email: "ktv7@synapse.com",
    role: "TECHNICIAN",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv7",
    skills: [
      { id: "s2", name: "Massage Body", code: "BODY" },
      { id: "s5", name: "Massage Cổ Vai Gáy", code: "NECK" },
      { id: "s4", name: "Gội đầu", code: "SHAMPOO" }
    ],
    isActive: true,
    phone: "0901234576",
    address: "707 TP. Thủ Đức, TP.HCM",
  },
  {
    id: "11",
    name: "Lý Thị Kỹ Thuật 8",
    email: "ktv8@synapse.com",
    role: "TECHNICIAN",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv8",
    skills: [
      { id: "s1", name: "Facial", code: "FACIAL" },
      { id: "s3", name: "Nặn mụn", code: "ACNE" }
    ],
    isActive: true,
    phone: "0901234577",
    address: "808 Quận 12, TP.HCM",
  },
  {
    id: "12",
    name: "Hồ Văn Kỹ Thuật 9",
    email: "ktv9@synapse.com",
    role: "TECHNICIAN",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv9",
    skills: [
      { id: "s2", name: "Massage Body", code: "BODY" },
      { id: "s6", name: "Laser", code: "LASER" }
    ],
    isActive: true,
    phone: "0901234578",
    address: "909 Huyện Bình Chánh, TP.HCM",
  },
  {
    id: "13",
    name: "Dương Thị Kỹ Thuật 10",
    email: "ktv10@synapse.com",
    role: "TECHNICIAN",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv10",
    skills: [
      { id: "s4", name: "Gội đầu", code: "SHAMPOO" },
      { id: "s9", name: "Triệt lông", code: "HAIR_REMOVAL" }
    ],
    isActive: true,
    phone: "0901234579",
    address: "111 Huyện Hóc Môn, TP.HCM",
  },
  {
    id: "14",
    name: "Mai Văn Kỹ Thuật 11",
    email: "ktv11@synapse.com",
    role: "TECHNICIAN",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv11",
    skills: [
      { id: "s5", name: "Massage Cổ Vai Gáy", code: "NECK" },
      { id: "s7", name: "Tắm trắng", code: "WHITENING" }
    ],
    isActive: false,
    phone: "0901234580",
    address: "222 Huyện Củ Chi, TP.HCM",
  },
  {
    id: "15",
    name: "Trương Thị Kỹ Thuật 12",
    email: "ktv12@synapse.com",
    role: "TECHNICIAN",
    avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=ktv12",
    skills: [
      { id: "s8", name: "Peel da", code: "PEEL" },
      { id: "s1", name: "Facial", code: "FACIAL" }
    ],
    isActive: true,
    phone: "0901234581",
    address: "333 Huyện Nhà Bè, TP.HCM",
  },
];

import { Skill } from "@/features/services/types";

export const MOCK_SKILLS: Skill[] = [
  { id: "s1", name: "Facial", code: "FACIAL" },
  { id: "s2", name: "Massage Body", code: "BODY" },
  { id: "s3", name: "Nặn mụn", code: "ACNE" },
  { id: "s4", name: "Gội đầu", code: "SHAMPOO" },
  { id: "s5", name: "Massage Cổ Vai Gáy", code: "NECK" },
  { id: "s6", name: "Laser", code: "LASER" },
  { id: "s7", name: "Tắm trắng", code: "WHITENING" },
  { id: "s8", name: "Peel da", code: "PEEL" },
  { id: "s9", name: "Triệt lông", code: "HAIR_REMOVAL" },
];
