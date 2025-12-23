"use client";

/**
 * OptionalMark - Component hiển thị nhãn (Tùy chọn) cho trường không bắt buộc
 *
 * Usage:
 * <FormLabel>Email <OptionalMark /></FormLabel>
 */
export function OptionalMark() {
  return (
    <span
      className="text-muted-foreground ml-1 text-xs font-normal"
      aria-hidden="true"
    >
      (Tùy chọn)
    </span>
  );
}
