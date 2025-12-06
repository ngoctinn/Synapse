import { MaintenanceTask, Resource } from "./types";

export const mockResources: Resource[] = [
  // Rooms
  {
    id: "r1",
    name: "Phòng VIP 1",
    code: "R-VIP-01",
    type: "ROOM",
    status: "ACTIVE",
    capacity: 1,
    description: "Phòng trị liệu cao cấp dành cho 1 khách",
    tags: ["vip", "private"],
    setupTime: 15,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "r2",
    name: "Phòng Đôi 1",
    code: "R-DBL-01",
    type: "ROOM",
    status: "ACTIVE",
    capacity: 2,
    description: "Phòng dành cho các cặp đôi",
    tags: ["couple"],
    setupTime: 10,
    createdAt: "2023-01-02T00:00:00Z",
  },
  {
    id: "r3",
    name: "Phòng Gội Đầu",
    code: "R-WASH-01",
    type: "ROOM",
    status: "MAINTENANCE",
    capacity: 4,
    description: "Khu vực gội đầu dưỡng sinh",
    tags: ["hair", "common"],
    createdAt: "2023-01-03T00:00:00Z",
  },
  // Equipment
  {
    id: "e1",
    name: "Máy Triệt Lông Diode Laser",
    code: "EQ-LASER-01",
    type: "EQUIPMENT",
    status: "ACTIVE",
    description: "Máy triệt lông công nghệ cao",
    tags: ["laser", "hair-removal"],
    setupTime: 5,
    createdAt: "2023-01-10T00:00:00Z",
  },
  {
    id: "e2",
    name: "Máy Soi Da 3D",
    code: "EQ-SKIN-01",
    type: "EQUIPMENT",
    status: "ACTIVE",
    description: "Phân tích tình trạng da chi tiết",
    tags: ["diagnosis", "skin"],
    createdAt: "2023-01-11T00:00:00Z",
  },
  {
    id: "e3",
    name: "Máy Xông Hơi Mặt",
    code: "EQ-STEAM-01",
    type: "EQUIPMENT",
    status: "INACTIVE",
    description: "Máy xông hơi nóng/lạnh",
    tags: ["facial", "basic"],
    createdAt: "2023-01-12T00:00:00Z",
  },
];

export const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    id: "mt1",
    resourceId: "e1",
    title: "Kiểm tra định kỳ Laser",
    date: new Date().toISOString(),
    status: "completed",
    assignedTo: "staff1",
  },
  {
    id: "mt2",
    resourceId: "e1",
    title: "Thay đầu bắn",
    date: new Date(Date.now() + 86400000 * 2).toISOString(), // +2 days
    status: "scheduled",
  },
  {
    id: "mt3",
    resourceId: "r3",
    title: "Bảo trì hệ thống nước",
    date: new Date().toISOString(),
    status: "in_progress",
  },
];
