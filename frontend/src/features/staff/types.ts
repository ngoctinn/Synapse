export type Role = 'ADMIN' | 'RECEPTIONIST' | 'TECHNICIAN';

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  skills: string[]; // e.g., ['Facial', 'Massage']
  isActive: boolean;
  phone?: string;
  address?: string;
  serviceIds?: string[]; // Maps to Service IDs for quick lookup
}

export type ShiftType = 'WORK' | 'OFF';

export interface Shift {
  id: string;
  name: string; // e.g., "Ca Sáng", "Nghỉ phép"
  color: string; // Hex code
  startTime: string; // "08:00"
  endTime: string; // "12:00"
  type: ShiftType;
}

export type ScheduleStatus = 'PUBLISHED' | 'DRAFT';

export interface Schedule {
  id: string;
  staffId: string;
  date: string; // ISO Date string (YYYY-MM-DD)
  shiftId: string;
  status: ScheduleStatus;
}

export interface Permission {
  moduleId: string;
  actions: {
    [key: string]: boolean; // e.g., view: true, edit: false
  };
}

export interface RolePermissions {
  [role: string]: {
    [moduleId: string]: string[]; // List of allowed actions
  };
}
