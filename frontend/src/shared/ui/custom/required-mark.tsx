"use client";

/**
 * RequiredMark - Component hiển thị dấu * cho trường bắt buộc
 *
 * Usage:
 * <FormLabel>Tên <RequiredMark /></FormLabel>
 */
export function RequiredMark() {
  return (
    <span className="text-destructive ml-0.5" aria-hidden="true">
      *
    </span>
  );
}
