import { Equipment, MaintenanceSchedule, MaintenanceTask } from './types';

export const mockEquipment: Equipment[] = [
  {
    id: 'eq-1',
    name: 'Máy Laser CO2 Fractional',
    code: 'EQ-LS-001',
    serialNumber: 'SN-2023-8899',
    model: 'Lutronic eCO2',
    status: 'active',
    location: 'Phòng Laser 1',
    lastMaintenanceDate: '2023-11-15',
    nextMaintenanceDate: '2023-12-15',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'eq-2',
    name: 'Máy Giảm Béo Hifu',
    code: 'EQ-HF-002',
    serialNumber: 'SN-2023-7766',
    model: 'Ultherapy',
    status: 'maintenance',
    location: 'Phòng Body 2',
    lastMaintenanceDate: '2023-10-20',
    nextMaintenanceDate: '2023-11-20',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: 'eq-3',
    name: 'Máy Xông Hơi Mặt',
    code: 'EQ-ST-003',
    status: 'active',
    location: 'Phòng Facial 1',
    lastMaintenanceDate: '2023-12-01',
    nextMaintenanceDate: '2024-01-01',
  },
  {
    id: 'eq-4',
    name: 'Giường Spa Cao Cấp',
    code: 'EQ-BD-004',
    status: 'active',
    location: 'Phòng VIP',
    lastMaintenanceDate: '2023-09-01',
    nextMaintenanceDate: '2024-03-01',
  }
];

export const mockSchedules: MaintenanceSchedule[] = [
  {
    id: 'sch-1',
    equipmentId: 'eq-1',
    title: 'Kiểm tra đầu bắn Laser',
    frequency: 'weekly',
    interval: 1,
    daysOfWeek: [1], // Thứ 2 hàng tuần
    startDate: '2023-01-01',
    assignedTo: 'staff-1'
  },
  {
    id: 'sch-2',
    equipmentId: 'eq-2',
    title: 'Bảo dưỡng định kỳ Hifu',
    frequency: 'monthly',
    interval: 1,
    dayOfMonth: 15,
    startDate: '2023-01-01',
    assignedTo: 'staff-2'
  }
];

export const mockTasks: MaintenanceTask[] = [
  {
    id: 'task-1',
    scheduleId: 'sch-1',
    equipmentId: 'eq-1',
    title: 'Kiểm tra đầu bắn Laser',
    date: '2023-12-04',
    status: 'completed',
    assignedTo: 'staff-1',
    notes: 'Đầu bắn hoạt động tốt, đã vệ sinh.'
  },
  {
    id: 'task-2',
    scheduleId: 'sch-1',
    equipmentId: 'eq-1',
    title: 'Kiểm tra đầu bắn Laser',
    date: '2023-12-11',
    status: 'scheduled',
    assignedTo: 'staff-1'
  },
  {
    id: 'task-3',
    scheduleId: 'sch-2',
    equipmentId: 'eq-2',
    title: 'Bảo dưỡng định kỳ Hifu',
    date: '2023-12-15',
    status: 'overdue',
    assignedTo: 'staff-2',
    notes: 'Chưa có linh kiện thay thế.'
  }
];
