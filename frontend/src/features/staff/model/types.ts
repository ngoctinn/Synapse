import { Skill } from "@/features/services/types";

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
  hired_at: string;
  created_at: string;
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

// ============================================================================
// SCHEDULING TYPES - Phù hợp với Database Design
// ============================================================================

/** Chế độ xem lịch */
export type ScheduleViewType = 'week' | 'month';

/** Trạng thái lịch */
export type ScheduleStatus = 'DRAFT' | 'PUBLISHED';

/**
 * Ca làm việc (Master Data)
 * Maps to DB table: shifts
 */
export interface Shift {
  id: string;
  name: string;           // "Ca Sáng", "Ca Chiều", "Ca Tối"
  startTime: string;      // "08:00" (DB: start_time TIME)
  endTime: string;        // "12:00" (DB: end_time TIME)
  colorCode: string;      // "#3b82f6" (DB: color_code VARCHAR(7))
}

/**
 * Phân công lịch làm việc
 * Maps to DB table: staff_schedules
 * UNIQUE constraint: (staff_id, work_date, shift_id) - Cho phép nhiều ca/ngày
 */
export interface Schedule {
  id: string;
  staffId: string;        // DB: staff_id UUID FK → staff_profiles
  shiftId: string;        // DB: shift_id UUID FK → shifts
  workDate: string;       // DB: work_date DATE (format: "2025-12-16")
  status: ScheduleStatus; // DB: status schedule_status
}

/**
 * Schedule với thông tin Shift đầy đủ (cho UI)
 */
export interface ScheduleWithShift extends Schedule {
  shift: Shift;
}

// ============================================================================
// UI TYPES
// ============================================================================

/** Khoảng thời gian */
export interface DateRange {
  start: Date;
  end: Date;
}

/** Bộ lọc lịch */
export interface ScheduleFilters {
  staffIds: string[];
  roles: Role[];
  status?: ScheduleStatus;
}

/** Ô lịch (1 ngày x 1 nhân viên) */
export interface ScheduleCell {
  staffId: string;
  date: Date;
  dateStr: string;  // "yyyy-MM-dd"
  schedules: ScheduleWithShift[];
}

/** Slot đã chọn (Selection Mode) */
export interface SelectedSlot {
  staffId: string;
  dateStr: string;  // "yyyy-MM-dd"
}

// ============================================================================
// PERMISSION TYPES
// ============================================================================

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
