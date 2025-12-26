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
        "group/cell relative min-h-[80px] border-r p-1 transition-all last:border-r-0",
        "flex flex-col gap-1",
        isToday ? "bg-primary/[0.03]" : "bg-background",
        !hasSchedules && !selectionMode && "hover:bg-muted/30",
        selectionMode && "hover:bg-primary/10 cursor-pointer",
        isSelected && "bg-primary/10 ring-primary/50 ring-[1.5px] ring-inset",
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
            "bg-muted/50 hover:bg-primary/10 hover:text-primary size-7 rounded-full",
            "flex cursor-pointer items-center justify-center transition-all",
            "focus:ring-primary/50 focus:outline-none focus:ring-[1.5px]",
            hasSchedules
              ? "absolute bottom-1 right-1 opacity-0 group-hover/cell:opacity-100"
              : "mx-auto my-auto"
          )}
        >
          <Plus className="size-4" />
        </button>
      )}

      {/* Selection indicator */}
      {selectionMode && isSelected && (
        <div className="bg-primary absolute right-1 top-1 flex size-4 items-center justify-center rounded-full">
          <span className="text-primary-foreground text-[10px] font-bold">
            ✓
          </span>
        </div>
      )}
    </div>
  );
}
