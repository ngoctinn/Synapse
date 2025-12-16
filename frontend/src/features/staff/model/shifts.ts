import { Shift } from "./types";

/**
 * Mock data cho Ca làm việc (Master Data)
 * Phù hợp với DB table: shifts
 */
export const MOCK_SHIFTS: Shift[] = [
  {
    id: "shift_morning",
    name: "Ca Sáng",
    colorCode: "#D97706", // Amber-600
    startTime: "08:00",
    endTime: "12:00",
  },
  {
    id: "shift_afternoon",
    name: "Ca Chiều",
    colorCode: "#2563EB", // Blue-600
    startTime: "13:00",
    endTime: "17:00",
  },
  {
    id: "shift_evening",
    name: "Ca Tối",
    colorCode: "#7C3AED", // Violet-600
    startTime: "17:00",
    endTime: "21:00",
  },
];

/**
 * Helper function để lấy Shift theo ID
 */
export function getShiftById(shiftId: string): Shift | undefined {
  return MOCK_SHIFTS.find((s) => s.id === shiftId);
}

/**
 * Helper: Lấy màu của shift
 */
export function getShiftColor(shiftId: string): string {
  return getShiftById(shiftId)?.colorCode ?? "#6B7280";
}
