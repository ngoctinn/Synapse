
import { TimeSlot } from "../model/types";

/**
 * Chuyển đổi chuỗi giờ "HH:mm" thành số phút từ đầu ngày.
 */
function toMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Kiểm tra xem thời gian bắt đầu có lớn hơn thời gian kết thúc không.
 */
export function checkInvalidRange(start: string, end: string): boolean {
  if (!start || !end) return false;
  return toMinutes(start) >= toMinutes(end);
}

/**
 * Kiểm tra xem có bất kỳ khung giờ nào bị trùng nhau không.
 */
export function checkOverlap(slots: TimeSlot[]): boolean {
  if (slots.length < 2) return false;

  // Sắp xếp các slot theo thời gian bắt đầu
  const sortedSlots = [...slots].sort((a, b) => 
    toMinutes(a.start) - toMinutes(b.start)
  );

  for (let i = 0; i < sortedSlots.length - 1; i++) {
    const current = sortedSlots[i];
    const next = sortedSlots[i + 1];

    // Nếu giờ kết thúc của slot hiện tại > giờ bắt đầu của slot tiếp theo -> trùng
    if (toMinutes(current.end) > toMinutes(next.start)) {
      return true;
    }
  }

  return false;
}

/**
 * Sắp xếp và gộp các khung giờ liền kề (Optional utility)
 */
export function normalizeSlots(slots: TimeSlot[]): TimeSlot[] {
  if (slots.length === 0) return [];
  
  const sorted = [...slots].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
  const result: TimeSlot[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = result[result.length - 1];
    const current = sorted[i];

    if (toMinutes(last.end) >= toMinutes(current.start)) {
       // Merge overlap/adjacent
       last.end = toMinutes(last.end) > toMinutes(current.end) ? last.end : current.end;
    } else {
       result.push(current);
    }
  }
  return result;
}
