"use client";

import { Check, Send, Trash2, X } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

import { MOCK_SHIFTS } from "../../../model/shifts";
import type { Shift } from "../../../model/types";

interface SelectionToolbarProps {
  selectedCount: number;
  onApplyShift: (shift: Shift) => void;
  onPublishAll: () => void;
  onDeleteAll: () => void;
  onCancel: () => void;
  className?: string;
}

/**
 * Floating toolbar khi ở selection mode
 */
export function SelectionToolbar({
  selectedCount,
  onApplyShift,
  onPublishAll,
  onDeleteAll,
  onCancel,
  className,
}: SelectionToolbarProps) {
  if (selectedCount === 0) return null;

  const handleShiftSelect = (shiftId: string) => {
    const shift = MOCK_SHIFTS.find((s) => s.id === shiftId);
    if (shift) {
      onApplyShift(shift);
    }
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
        "flex items-center gap-2 rounded-full px-4 py-2.5",
        "bg-background/95 border shadow-xl backdrop-blur-md",
        "animate-in slide-in-from-bottom-4 duration-300",
        className
      )}
    >
      {/* Selected count */}
      <div className="flex items-center gap-2 border-r px-2 pr-3">
        <Check className="text-primary size-4" />
        <span className="text-sm font-medium">
          Đã chọn <strong>{selectedCount}</strong> ô
        </span>
      </div>

      {/* Apply shift dropdown */}
      <Select onValueChange={handleShiftSelect}>
        <SelectTrigger className="h-8 w-[140px] text-xs">
          <SelectValue placeholder="Áp dụng ca..." />
        </SelectTrigger>
        <SelectContent>
          {MOCK_SHIFTS.map((shift) => (
            <SelectItem key={shift.id} value={shift.id}>
              <div className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: shift.colorCode }}
                />
                {shift.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Publish all */}
      <Button
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 px-3"
        onClick={onPublishAll}
      >
        <Send className="size-3.5" />
        <span className="hidden sm:inline">Công bố</span>
      </Button>

      {/* Delete all */}
      <Button
        variant="outline"
        size="sm"
        className="text-destructive hover:text-destructive h-8 gap-1.5 px-3"
        onClick={onDeleteAll}
      >
        <Trash2 className="size-3.5" />
        <span className="hidden sm:inline">Xóa</span>
      </Button>

      {/* Cancel */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={onCancel}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
