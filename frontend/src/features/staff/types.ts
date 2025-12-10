import { Skill } from "../services/types";

export type Role = 'admin' | 'receptionist' | 'technician' | 'customer';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone_number: string | null;
  role: Role;
  is_active: boolean;
}

export interface Staff {
  user_id: string;
  hired_at: string; // Date string
  created_at: string; // Date string
  bio: string | null;
  title: string;
  color_code: string;
  commission_rate: number;


  user: User;
  skills: Skill[];
}

export interface StaffInvite {
  email: string;
  role: Role;
  full_name: string;
  title: string;
  bio?: string;
}

export interface StaffUpdate {
  bio?: string;
  title?: string;
  color_code?: string;
  commission_rate?: number;
}

export interface StaffListResponse {
  data: Staff[];
  total: number;
  page: number;
  limit: number;
}


export type ShiftType = 'WORK' | 'OFF';

export interface Shift {
  id: string;
  name: string;
  color: string;
  startTime: string;
  endTime: string;
  type: ShiftType;
}

export type ScheduleStatus = 'PUBLISHED' | 'DRAFT';

export interface Schedule {
  id: string;
  staffId: string;
  date: string;
  shiftId: string;
  status: ScheduleStatus;
  shift?: Shift;
  customShift?: Shift; // For optimistic UI when shift doesn't exist in DB yet
}

export interface Permission {
  moduleId: string;
  actions: {
    [key: string]: boolean;
  };
}

export interface RolePermissions {
  [role: string]: {
    [moduleId: string]: string[];
  };
}
