import { ExceptionType, TimeSlot } from "./types";

export const DEFAULT_OPEN_TIME = "08:00";
export const DEFAULT_CLOSE_TIME = "21:00";
export const DEFAULT_EXCEPTION_OPEN = "09:00";
export const DEFAULT_EXCEPTION_CLOSE = "18:00";

export const EXCEPTION_TYPE_LABELS: Record<ExceptionType, string> = {
  HOLIDAY: "Nghỉ lễ",
  MAINTENANCE: "Bảo trì",
  SPECIAL_HOURS: "Giờ đặc biệt",
  CUSTOM: "Tùy chỉnh",
};

export const EXCEPTION_TYPE_VARIANTS: Record<
  ExceptionType,
  "destructive" | "secondary" | "outline" | "default"
> = {
  HOLIDAY: "destructive",
  MAINTENANCE: "secondary",
  SPECIAL_HOURS: "default",
  CUSTOM: "outline",
};

/**
 * Chuyển đổi time string "HH:mm" thành số phút từ 00:00
 */
export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

/**
 * Kiểm tra xem 2 time slot có overlap không
 * @returns true nếu có overlap
 */
export function checkTimeSlotOverlap(
  slot1: TimeSlot,
  slot2: TimeSlot
): boolean {
  const start1 = timeToMinutes(slot1.start);
  const end1 = timeToMinutes(slot1.end);
  const start2 = timeToMinutes(slot2.start);
  const end2 = timeToMinutes(slot2.end);

  // Overlap xảy ra khi: start1 < end2 AND start2 < end1
  return start1 < end2 && start2 < end1;
}

/**
 * Kiểm tra một time slot có hợp lệ không (start < end)
 */
export function isValidTimeSlot(slot: TimeSlot): boolean {
  return timeToMinutes(slot.start) < timeToMinutes(slot.end);
}

/**
 * Tìm tất cả các cặp time slot bị overlap trong danh sách
 * @returns Mảng các cặp index [i, j] bị overlap
 */
export function findOverlappingSlots(slots: TimeSlot[]): [number, number][] {
  const overlaps: [number, number][] = [];

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      if (checkTimeSlotOverlap(slots[i], slots[j])) {
        overlaps.push([i, j]);
      }
    }
  }

  return overlaps;
}

/**
 * Validate toàn bộ danh sách time slots
 * @returns Object chứa validation status và messages
 */
export function validateTimeSlots(slots: TimeSlot[]): {
  isValid: boolean;
  errors: string[];
  invalidSlotIndexes: number[];
  overlappingPairs: [number, number][];
} {
  const errors: string[] = [];
  const invalidSlotIndexes: number[] = [];

  // Check từng slot có hợp lệ không (start < end)
  slots.forEach((slot, index) => {
    if (!isValidTimeSlot(slot)) {
      invalidSlotIndexes.push(index);
      errors.push(`Ca ${index + 1}: Giờ bắt đầu phải nhỏ hơn giờ kết thúc`);
    }
  });

  // Check overlap giữa các slots
  const overlappingPairs = findOverlappingSlots(slots);
  overlappingPairs.forEach(([i, j]) => {
    errors.push(`Ca ${i + 1} và Ca ${j + 1} bị trùng giờ`);
  });

  return {
    isValid: errors.length === 0,
    errors,
    invalidSlotIndexes,
    overlappingPairs,
  };
}
