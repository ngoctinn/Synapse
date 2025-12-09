import { Shift } from "../types";

export const MOCK_SHIFTS: Shift[] = [
  {
    id: "shift_morning",
    name: "Ca Sáng",
    color: "#F59E0B",
    startTime: "08:00",
    endTime: "12:00",
    type: "WORK",
  },
  {
    id: "shift_afternoon",
    name: "Ca Chiều",
    color: "#3B82F6",
    startTime: "13:00",
    endTime: "17:00",
    type: "WORK",
  },
  {
    id: "shift_evening",
    name: "Ca Tối",
    color: "#8B5CF6",
    startTime: "17:00",
    endTime: "21:00",
    type: "WORK",
  },
  {
    id: "shift_off",
    name: "Nghỉ Phép",
    color: "#9CA3AF",
    startTime: "00:00",
    endTime: "23:59",
    type: "OFF",
  },
];
