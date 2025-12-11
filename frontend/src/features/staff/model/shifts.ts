import { Shift } from "./types";

export const MOCK_SHIFTS: Shift[] = [
  {
    id: "shift_morning",
    name: "Ca Sáng",
    color: "#D97706", // Amber-600 (Better contrast)
    startTime: "08:00",
    endTime: "12:00",
    type: "WORK",
  },
  {
    id: "shift_afternoon",
    name: "Ca Chiều",
    color: "#2563EB", // Blue-600
    startTime: "13:00",
    endTime: "17:00",
    type: "WORK",
  },
  {
    id: "shift_evening",
    name: "Ca Tối",
    color: "#7C3AED", // Violet-600
    startTime: "17:00",
    endTime: "21:00",
    type: "WORK",
  },
  {
    id: "shift_off",
    name: "Nghỉ Phép",
    color: "#6B7280", // Gray-500
    startTime: "00:00",
    endTime: "23:59",
    type: "OFF",
  },
];
