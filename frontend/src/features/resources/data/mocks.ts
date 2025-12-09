import { MaintenanceTask, Resource } from "../types";

export const mockResources: Resource[] = [
  {
    id: "r1",
    name: "Phòng VIP 1",
    code: "VIP-01",
    type: "ROOM",
    status: "ACTIVE",
    capacity: 2,
    setupTime: 15,
    description: "Phòng điều trị VIP với trang thiết bị hiện đại",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-06-15T00:00:00Z",
  },
  {
    id: "r2",
    name: "Máy Laser CO2",
    code: "EQ-LASER-01",
    type: "EQUIPMENT",
    status: "ACTIVE",
    tags: ["Laser", "Skin Care"],
    setupTime: 10,
    createdAt: "2023-02-10T00:00:00Z",
    updatedAt: "2023-02-10T00:00:00Z",
  },
  {
    id: "r3",
    name: "Giường Massage 05",
    code: "BED-05",
    type: "ROOM", // Sometime beds are treated as room/slots
    status: "MAINTENANCE",
    capacity: 1,
    setupTime: 5,
    description: "Đang bảo trì định kỳ",
    createdAt: "2023-03-05T00:00:00Z",
    updatedAt: "2023-12-01T00:00:00Z",
  }
];

export const mockMaintenanceTasks: MaintenanceTask[] = [
  {
    id: "m1",
    resourceId: "r3",
    title: "Thay đệm mới",
    date: "2023-12-05T09:00:00Z",
    status: "in_progress",
    assignedTo: "staff-01",
    notes: "Đang chờ nhập hàng"
  }
];
