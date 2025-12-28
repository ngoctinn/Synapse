"use client";

import { cn } from "@/shared/lib/utils";
import * as React from "react";

interface RequiredMarkProps extends React.HTMLAttributes<HTMLSpanElement> {}

/**
 * Hiển thị dấu * màu đỏ cho các trường bắt buộc.
 * Thường dùng trong Label của các form.
 */
export function RequiredMark({ className, ...props }: RequiredMarkProps) {
  return (
    <span
      className={cn("text-destructive ml-0.5 font-medium", className)}
      aria-hidden="true"
      {...props}
    >
      *
    </span>
  );
}
