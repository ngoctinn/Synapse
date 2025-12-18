"use client";

/**
 * DroppableSlot - Vùng thả cho event trên calendar
 *
 * Sử dụng useDroppable từ @dnd-kit.
 * Highlight khi có event đang được kéo qua.
 */

import { useDroppable } from "@dnd-kit/core";

import { cn } from "@/shared/lib/utils";

import type { DropData } from "./calendar-dnd-context";


interface DroppableSlotProps {
  /** ID duy nhất cho slot */
  id: string;
  /** Ngày của slot */
  date: Date;
  /** Giờ (0-23) */
  hour: number;
  /** Phút (0, 15, 30, 45) */
  minute: number;
  /** Nội dung bên trong slot */
  children?: React.ReactNode;
  /** Slot bị vô hiệu hóa (quá khứ, break time) */
  disabled?: boolean;
  /** Chiều cao slot */
  height?: number;
  className?: string;
}


export function DroppableSlot({
  id,
  date,
  hour,
  minute,
  children,
  disabled = false,
  height = 30,
  className,
}: DroppableSlotProps) {
  const dropData: DropData = {
    type: "slot",
    date,
    hour,
    minute,
  };

  const { isOver, setNodeRef, active } = useDroppable({
    id,
    data: dropData,
    disabled,
  });

  // Xác định trạng thái hiển thị
  const isActive = active !== null; // Có đang kéo gì đó
  const isHovered = isOver && !disabled;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "relative transition-colors duration-150",
        // Trạng thái cơ bản
        disabled && "bg-muted/40 cursor-not-allowed",
        // Highlight khi đang kéo
        isActive && !disabled && "bg-primary/5",
        // Highlight khi hover
        isHovered && "bg-primary/20 ring-2 ring-primary/50 ring-inset",
        className
      )}
      style={{ minHeight: height }}
    >
      {/* Drop indicator */}
      {isHovered && (
        <div className="absolute inset-x-0 top-0 h-1 bg-primary rounded-full animate-pulse" />
      )}

      {/* Content */}
      {children}
    </div>
  );
}
