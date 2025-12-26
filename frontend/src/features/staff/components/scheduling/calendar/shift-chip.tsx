"use client";

import { FileEdit } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

import { Shift } from "../../../model/types";

interface ShiftChipProps {
  shift: Shift;
  isDraft?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Component hiển thị 1 ca làm việc dạng chip
 * Style: Chữ đậm + nền nhạt (colorCode + opacity)
 * DRAFT: border-dashed + icon nhỏ + tooltip hướng dẫn
 */
export function ShiftChip({
  shift,
  isDraft = false,
  isSelected = false,
  onClick,
  className,
}: ShiftChipProps) {
  const chip = (
    <button
      type="button"
      onClick={onClick}
      title={
        isDraft
          ? "Bản nháp - Nhấp để xem và công bố"
          : "Đã công bố - Nhấp để xem chi tiết"
      }
      className={cn(
        "relative w-full rounded-lg px-2.5 py-1.5 text-left",
        "cursor-pointer transition-all",
        "focus:ring-primary/50 focus:outline-none focus:ring-[1.5px]",
        "hover:shadow-sm",
        isDraft && "border-2 border-dashed",
        isSelected && "ring-primary ring-[1.5px] ring-offset-1",
        className
      )}
      style={{
        backgroundColor: isDraft
          ? `${shift.colorCode}08`
          : `${shift.colorCode}18`,
        color: shift.colorCode,
        borderColor: isDraft ? shift.colorCode : "transparent",
      }}
    >
      <div className="flex items-start justify-between gap-1">
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold leading-tight">
            {shift.name}
          </div>
          <div
            className="text-[10px] leading-tight opacity-70"
            style={{ color: shift.colorCode }}
          >
            {shift.startTime} - {shift.endTime}
          </div>
        </div>
        {/* Draft indicator */}
        {isDraft && <FileEdit className="mt-0.5 size-3 shrink-0 opacity-60" />}
      </div>
    </button>
  );

  // Wrap với Tooltip cho DRAFT
  if (isDraft) {
    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>{chip}</TooltipTrigger>
        <TooltipContent side="top" className="text-xs">
          <p>Bản nháp - Nhấp để công bố</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return chip;
}

/**
 * Variant nhỏ gọn cho Month View
 */
export function ShiftChipMini({
  shift,
  isDraft = false,
  onClick,
  className,
}: ShiftChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={isDraft ? "Bản nháp" : "Đã công bố"}
      className={cn(
        "h-5 w-full truncate rounded px-1.5 text-[10px] font-medium",
        "flex cursor-pointer items-center gap-1 text-left transition-colors",
        "hover:opacity-80",
        isDraft && "border border-dashed",
        className
      )}
      style={{
        backgroundColor: isDraft
          ? `${shift.colorCode}10`
          : `${shift.colorCode}20`,
        color: shift.colorCode,
        borderColor: isDraft ? shift.colorCode : "transparent",
      }}
    >
      {isDraft && <FileEdit className="size-2.5 shrink-0" />}
      <span className="truncate">{shift.name}</span>
    </button>
  );
}

/**
 * Variant lớn cho hiển thị trong List/Sheet
 * Style: Chữ đậm + nền nhạt (cho AddScheduleSheet, ShiftManagerSheet)
 */
export function ShiftChipLarge({ shift, onClick, className }: ShiftChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg p-4",
        "cursor-pointer text-left transition-colors",
        "focus:ring-primary/50 focus:outline-none focus:ring-[1.5px]",
        "hover:opacity-90",
        className
      )}
      style={{
        backgroundColor: `${shift.colorCode}12`,
      }}
    >
      <div
        className="h-12 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: shift.colorCode }}
      />
      <div className="flex-1">
        <div className="font-semibold" style={{ color: shift.colorCode }}>
          {shift.name}
        </div>
        <div className="text-sm opacity-70" style={{ color: shift.colorCode }}>
          {shift.startTime} - {shift.endTime}
        </div>
      </div>
    </button>
  );
}

/**
 * Variant cho hiển thị trong detail sheet (info card)
 */
export function ShiftInfoCard({
  shift,
  className,
}: {
  shift: Shift;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-lg p-4", className)}
      style={{ backgroundColor: `${shift.colorCode}12` }}
    >
      <div className="text-lg font-semibold" style={{ color: shift.colorCode }}>
        {shift.name}
      </div>
      <div
        className="mt-1 text-sm opacity-80"
        style={{ color: shift.colorCode }}
      >
        {shift.startTime} - {shift.endTime}
      </div>
    </div>
  );
}
