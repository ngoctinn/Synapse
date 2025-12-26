"use client";

import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";
import { Icon } from "@/shared/ui/custom";
import type { Shift } from "../../../../model/types";

interface ShiftItemProps {
  shift: Shift;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function ShiftItem({
  shift,
  isEditing,
  onEdit,
  onDelete,
}: ShiftItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg p-3 transition-all",
        isEditing ? "ring-primary ring-[1.5px] ring-offset-2" : ""
      )}
      style={{ backgroundColor: `${shift.colorCode}12` }}
    >
      <div
        className="h-9 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: shift.colorCode }}
      />
      <div className="min-w-0 flex-1">
        <div
          className="truncate font-semibold"
          style={{ color: shift.colorCode }}
        >
          {shift.name}
        </div>
        <div className="text-xs opacity-70" style={{ color: shift.colorCode }}>
          {shift.startTime} - {shift.endTime}
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 hover:bg-white/50"
          onClick={onEdit}
        >
          <Icon icon={Pencil} className="size-4" style={{ color: shift.colorCode }} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-destructive hover:text-destructive h-8 w-8 hover:bg-white/50"
          onClick={onDelete}
        >
          <Icon icon={Trash2} className="size-4" />
        </Button>
      </div>
    </div>
  );
}
