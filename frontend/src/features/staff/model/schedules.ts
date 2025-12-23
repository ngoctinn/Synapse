import { addDays, format, startOfWeek } from "date-fns";
import { getShiftById } from "./shifts";
import { Schedule, ScheduleWithShift } from "./types";

/**
 * Tạo danh sách ngày trong tuần hiện tại (Thứ 2 → Chủ Nhật)
 */
const getCurrentWeekDates = () => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  return Array.from({ length: 7 }).map((_, i) =>
    format(addDays(start, i), "yyyy-MM-dd")
  );
};

const weekDates = getCurrentWeekDates();

/**
 * Mock data cho Lịch làm việc
 * Phù hợp với DB table: staff_schedules
 * UNIQUE (staff_id, work_date, shift_id) - Cho phép nhiều ca/ngày
 */
export const MOCK_SCHEDULES: Schedule[] = [
  // Staff 4 (KTV 1) - Có ngày làm 2 ca
  {
    id: "sch_1",
    staffId: "4",
    workDate: weekDates[0],
    shiftId: "shift_morning",
    status: "PUBLISHED",
  },
  {
    id: "sch_2",
    staffId: "4",
    workDate: weekDates[0],
    shiftId: "shift_afternoon",
    status: "PUBLISHED",
  },
  {
    id: "sch_3",
    staffId: "4",
    workDate: weekDates[1],
    shiftId: "shift_morning",
    status: "PUBLISHED",
  },
  {
    id: "sch_4",
    staffId: "4",
    workDate: weekDates[3],
    shiftId: "shift_morning",
    status: "PUBLISHED",
  },
  {
    id: "sch_5",
    staffId: "4",
    workDate: weekDates[4],
    shiftId: "shift_evening",
    status: "DRAFT",
  },

  // Staff 5 (KTV 2)
  {
    id: "sch_6",
    staffId: "5",
    workDate: weekDates[0],
    shiftId: "shift_afternoon",
    status: "PUBLISHED",
  },
  {
    id: "sch_7",
    staffId: "5",
    workDate: weekDates[1],
    shiftId: "shift_afternoon",
    status: "PUBLISHED",
  },
  {
    id: "sch_8",
    staffId: "5",
    workDate: weekDates[2],
    shiftId: "shift_evening",
    status: "PUBLISHED",
  },
  {
    id: "sch_9",
    staffId: "5",
    workDate: weekDates[3],
    shiftId: "shift_morning",
    status: "DRAFT",
  },
  {
    id: "sch_10",
    staffId: "5",
    workDate: weekDates[3],
    shiftId: "shift_afternoon",
    status: "DRAFT",
  },

  // Staff 2 (Receptionist 1)
  {
    id: "sch_11",
    staffId: "2",
    workDate: weekDates[0],
    shiftId: "shift_morning",
    status: "PUBLISHED",
  },
  {
    id: "sch_12",
    staffId: "2",
    workDate: weekDates[1],
    shiftId: "shift_morning",
    status: "PUBLISHED",
  },
  {
    id: "sch_13",
    staffId: "2",
    workDate: weekDates[2],
    shiftId: "shift_morning",
    status: "PUBLISHED",
  },
  {
    id: "sch_14",
    staffId: "2",
    workDate: weekDates[3],
    shiftId: "shift_morning",
    status: "PUBLISHED",
  },
  {
    id: "sch_15",
    staffId: "2",
    workDate: weekDates[4],
    shiftId: "shift_morning",
    status: "PUBLISHED",
  },
];

/**
 * Helper: Enrich schedules with shift data
 */
export function getSchedulesWithShifts(
  schedules: Schedule[]
): ScheduleWithShift[] {
  return schedules
    .map((schedule) => {
      const shift = getShiftById(schedule.shiftId);
      if (!shift) return null;
      return { ...schedule, shift };
    })
    .filter((s): s is ScheduleWithShift => s !== null);
}

/**
 * Helper: Lấy schedules theo staffId và workDate
 */
export function getSchedulesByStaffAndDate(
  schedules: Schedule[],
  staffId: string,
  workDate: string
): ScheduleWithShift[] {
  const filtered = schedules.filter(
    (s) => s.staffId === staffId && s.workDate === workDate
  );
  return getSchedulesWithShifts(filtered);
}

/**
 * Helper: Đếm tổng schedules trong 1 ngày
 */
export function countSchedulesOnDate(
  schedules: Schedule[],
  workDate: string
): number {
  return schedules.filter((s) => s.workDate === workDate).length;
}
