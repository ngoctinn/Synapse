export type EquipmentStatus = 'active' | 'maintenance' | 'broken';
export type MaintenanceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type MaintenanceStatus = 'scheduled' | 'in_progress' | 'completed' | 'overdue' | 'skipped';

export interface Equipment {
  id: string;
  name: string;
  code: string; // Mã thiết bị
  serialNumber?: string;
  model?: string;
  status: EquipmentStatus;
  location?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  image?: string;
}

export interface MaintenanceSchedule {
  id: string;
  equipmentId: string;
  title: string;
  description?: string;
  frequency: MaintenanceFrequency;
  interval: number; // e.g., 2 (weeks)
  daysOfWeek?: number[]; // 0=Sun, 1=Mon... for weekly
  dayOfMonth?: number; // for monthly
  startDate: string;
  endDate?: string;
  assignedTo?: string; // Staff ID
}

export interface MaintenanceTask {
  id: string;
  scheduleId?: string;
  equipmentId: string;
  title: string;
  date: string;
  status: MaintenanceStatus;
  assignedTo?: string;
  notes?: string;
}
