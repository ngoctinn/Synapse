"use client";

import { Plus } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { ScheduleWithShift } from "../../../model/types";
import { ShiftChip } from "./shift-chip";

interface ScheduleCellProps {
  schedules: ScheduleWithShift[];
  isToday?: boolean;
  isSelected?: boolean;
  selectionMode?: boolean;
  onAddClick: () => void;
  onScheduleClick: (schedule: ScheduleWithShift) => void;
  onCellClick?: () => void;
  className?: string;
}

/**
 * Ô đơn lẻ trong lưới lịch (1 ngày x 1 nhân viên)
 * Hiển thị danh sách các ca đã được phân công
 */
export function ScheduleCell({
  schedules,
  isToday = false,
  isSelected = false,
  selectionMode = false,
  onAddClick,
  onScheduleClick,
  onCellClick,
  className,
}: ScheduleCellProps) {
  const hasSchedules = schedules.length > 0;

  const handleCellClick = (e: React.MouseEvent) => {
    if (selectionMode && onCellClick) {
      e.stopPropagation();
      onCellClick();
    }
  };

  return (
    <div
      onClick={handleCellClick}
      className={cn(
        "p-1 border-r last:border-r-0 min-h-[80px] relative transition-all group/cell",
        "flex flex-col gap-1",
        isToday ? "bg-primary/[0.03]" : "bg-background",
        !hasSchedules && !selectionMode && "hover:bg-muted/30",
        selectionMode && "cursor-pointer hover:bg-primary/10",
        isSelected && "bg-primary/10 ring-2 ring-inset ring-primary/50",
        className
      )}
    >
      {/* Render các ca đã phân công */}
      {schedules.map((schedule) => (
        <ShiftChip
          key={schedule.id}
          shift={schedule.shift}
          isDraft={schedule.status === "DRAFT"}
          onClick={() => !selectionMode && onScheduleClick(schedule)}
        />
      ))}

      {/* Nút thêm ca (hiển thị khi hover hoặc trống) */}
      {!selectionMode && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAddClick();
          }}
          aria-label="Thêm ca làm việc"
          className={cn(
            "size-7 rounded-full bg-muted/50 hover:bg-primary/10 hover:text-primary",
            "flex items-center justify-center transition-all cursor-pointer",
            "focus:ring-2 focus:ring-primary/50 focus:outline-none",
            hasSchedules
              ? "opacity-0 group-hover/cell:opacity-100 absolute bottom-1 right-1"
              : "mx-auto my-auto"
          )}
        >
          <Plus className="size-4" />
        </button>
      )}

      {/* Selection indicator */}
      {selectionMode && isSelected && (
        <div className="absolute top-1 right-1 size-4 rounded-full bg-primary flex items-center justify-center">
          <span className="text-[10px] text-primary-foreground font-bold">✓</span>
        </div>
      )}
    </div>
  );
}
