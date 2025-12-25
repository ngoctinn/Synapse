"use client";

import { Clock } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button, Input } from "@/shared/ui";
import { Icon } from "@/shared/ui/custom";

const DEFAULT_COLORS = [
  "#D97706", // Amber
  "#2563EB", // Blue
  "#7C3AED", // Violet
  "#059669", // Emerald
  "#DC2626", // Red
  "#EA580C", // Orange
  "#0891B2", // Cyan
];

interface ShiftFormProps {
  title: string;
  name: string;
  onNameChange: (val: string) => void;
  startTime: string;
  onStartTimeChange: (val: string) => void;
  endTime: string;
  onEndTimeChange: (val: string) => void;
  color: string;
  onColorChange: (val: string) => void;
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

export function ShiftForm({
  title,
  name,
  onNameChange,
  startTime,
  onStartTimeChange,
  endTime,
  onEndTimeChange,
  color,
  onColorChange,
  onCancel,
  onSubmit,
  submitLabel,
}: ShiftFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">{title}</h3>

      {/* Name */}
      <div className="space-y-1.5">
        <label className="text-muted-foreground text-sm">Tên ca</label>
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Ví dụ: Ca sáng, Ca tối..."
        />
      </div>

      {/* Time */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-sm">Bắt đầu</label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => onStartTimeChange(e.target.value)}
            startContent={<Icon icon={Clock} className="size-4" />}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-muted-foreground text-sm">Kết thúc</label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => onEndTimeChange(e.target.value)}
            startContent={<Icon icon={Clock} className="size-4" />}
          />
        </div>
      </div>

      {/* Color */}
      <div className="space-y-1.5">
        <label className="text-muted-foreground text-sm">Màu sắc</label>
        <div className="flex flex-wrap gap-2">
          {DEFAULT_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onColorChange(c)}
              className={cn(
                "h-8 w-8 rounded-full transition-all",
                color === c && "ring-primary ring-2 ring-offset-2"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onCancel}
        >
          Hủy
        </Button>
        <Button size="sm" className="flex-1" onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
