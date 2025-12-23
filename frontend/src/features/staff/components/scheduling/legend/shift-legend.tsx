"use client";

import { Info } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { MOCK_SHIFTS } from "../../../model/shifts";

interface ShiftLegendProps {
  className?: string;
}

/**
 * Component chú giải màu ca làm việc
 */
export function ShiftLegend({ className }: ShiftLegendProps) {
  return (
    <div
      className={cn(
        "text-muted-foreground flex items-center gap-4 text-xs",
        className
      )}
    >
      <div className="flex items-center gap-1">
        <Info className="size-3.5" />
        <span>Chú giải:</span>
      </div>

      {MOCK_SHIFTS.map((shift) => (
        <div key={shift.id} className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 rounded-sm"
            style={{ backgroundColor: shift.colorCode }}
          />
          <span>
            {shift.name} ({shift.startTime}-{shift.endTime})
          </span>
        </div>
      ))}

      <div className="ml-2 flex items-center gap-3 border-l pl-3">
        <div className="flex items-center gap-1.5">
          <div className="bg-muted border-muted-foreground/30 h-3 w-4 rounded-sm border-2 border-dashed" />
          <span>Bản nháp</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="bg-muted border-muted-foreground/50 h-3 w-4 rounded-sm border-2 border-solid" />
          <span>Đã công bố</span>
        </div>
      </div>
    </div>
  );
}
