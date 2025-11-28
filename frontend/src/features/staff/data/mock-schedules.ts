import { addDays, format, startOfWeek } from "date-fns";
import { Schedule } from "../types";
import { MOCK_SHIFTS } from "./mock-shifts";
import { MOCK_STAFF } from "./mock-staff";

// Helper to generate dates for the current week
const getCurrentWeekDates = () => {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday start
  return Array.from({ length: 7 }).map((_, i) => format(addDays(start, i), "yyyy-MM-dd"));
};

const weekDates = getCurrentWeekDates();
const staffIds = MOCK_STAFF.map((s) => s.id);
const shiftIds = MOCK_SHIFTS.map((s) => s.id);

// Generate some random schedules
export const MOCK_SCHEDULES: Schedule[] = [
  // Staff 4 (KTV 1) - Full week
  { id: "sch_1", staffId: "4", date: weekDates[0], shiftId: "shift_morning", status: "PUBLISHED" },
  { id: "sch_2", staffId: "4", date: weekDates[0], shiftId: "shift_afternoon", status: "PUBLISHED" },
  { id: "sch_3", staffId: "4", date: weekDates[1], shiftId: "shift_morning", status: "PUBLISHED" },
  { id: "sch_4", staffId: "4", date: weekDates[2], shiftId: "shift_off", status: "PUBLISHED" }, // Off Wednesday
  { id: "sch_5", staffId: "4", date: weekDates[3], shiftId: "shift_morning", status: "PUBLISHED" },
  { id: "sch_6", staffId: "4", date: weekDates[4], shiftId: "shift_morning", status: "PUBLISHED" },

  // Staff 5 (KTV 2)
  { id: "sch_7", staffId: "5", date: weekDates[0], shiftId: "shift_afternoon", status: "PUBLISHED" },
  { id: "sch_8", staffId: "5", date: weekDates[1], shiftId: "shift_afternoon", status: "PUBLISHED" },
  { id: "sch_9", staffId: "5", date: weekDates[2], shiftId: "shift_afternoon", status: "PUBLISHED" },

  // Staff 2 (Receptionist 1)
  { id: "sch_10", staffId: "2", date: weekDates[0], shiftId: "shift_morning", status: "PUBLISHED" },
  { id: "sch_11", staffId: "2", date: weekDates[1], shiftId: "shift_morning", status: "PUBLISHED" },
  { id: "sch_12", staffId: "2", date: weekDates[2], shiftId: "shift_morning", status: "PUBLISHED" },
  { id: "sch_13", staffId: "2", date: weekDates[3], shiftId: "shift_morning", status: "PUBLISHED" },
  { id: "sch_14", staffId: "2", date: weekDates[4], shiftId: "shift_morning", status: "PUBLISHED" },
];
