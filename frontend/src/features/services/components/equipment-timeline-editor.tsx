"use client";
import { Resource } from "@/features/resources";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Plus, Trash2, X } from "lucide-react";
import { EquipmentUsage } from "../model/types";

interface EquipmentTimelineEditorProps {
  /** Thời lượng dịch vụ (phút) - dùng để vẽ visual bar */
  serviceDuration: number;
  /** Danh sách thiết bị khả dụng */
  availableEquipment: Resource[];
  /** Giá trị hiện tại */
  value: EquipmentUsage[];
  /** Callback khi thay đổi */
  onChange: (value: EquipmentUsage[]) => void;
  /** Disabled state */
  disabled?: boolean;
}

const COLORS = [
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-violet-500",
  "bg-cyan-500",
];

export function EquipmentTimelineEditor({
  serviceDuration,
  availableEquipment,
  value,
  onChange,
  disabled,
}: EquipmentTimelineEditorProps) {
  const handleAdd = () => {
    if (availableEquipment.length === 0) return;
    const firstAvailable = availableEquipment.find(
      (eq) => !value.some((v) => v.equipment_id === eq.id)
    );
    if (!firstAvailable) return;

    onChange([
      ...value,
      {
        equipment_id: firstAvailable.id,
        start_delay: 0,
        usage_duration: Math.min(15, serviceDuration),
      },
    ]);
  };

  const handleUpdate = (index: number, updates: Partial<EquipmentUsage>) => {
    const newValue = [...value];
    newValue[index] = { ...newValue[index], ...updates };
    onChange(newValue);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const getPercent = (minutes: number) => {
    if (serviceDuration <= 0) return 0;
    return Math.min(100, (minutes / serviceDuration) * 100);
  };

  const unusedEquipment = availableEquipment.filter(
    (eq) => !value.some((v) => v.equipment_id === eq.id)
  );

  if (availableEquipment.length === 0) {
    return (
      <div className="text-muted-foreground py-6 text-center text-sm border rounded-lg border-dashed">
        <Trash2 className="mx-auto mb-2 h-8 w-8 opacity-50" />
        <p>Chưa có thiết bị nào trong hệ thống</p>
        <p className="text-xs">
          Vui lòng thêm thiết bị trong Quản lý Tài nguyên
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Thiết bị sử dụng</Label>
        {unusedEquipment.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1"
            onClick={handleAdd}
            disabled={disabled}
          >
            <Plus className="h-3 w-3" />
            Thêm thiết bị
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {value.length === 0 && (
            <div className="text-muted-foreground bg-muted/20 flex h-20 items-center justify-center rounded-lg border border-dashed text-sm">
                Không yêu cầu thiết bị nào
            </div>
        )}

        {value.map((item, index) => {
          const colorClass = COLORS[index % COLORS.length];
          const leftPct = getPercent(item.start_delay);
          const widthPct = getPercent(item.usage_duration);
          const endTime = item.start_delay + item.usage_duration;
          const isOverflow = endTime > serviceDuration;

          return (
            <Card key={index} className="p-3 border shadow-sm">
              <div className="flex flex-col gap-3">
                {/* Header: Select Equipment + Delete */}
                <div className="flex items-center gap-3">
                    <div className={cn("h-3 w-3 rounded-full shrink-0", colorClass)} />
                    <Select
                        value={item.equipment_id}
                        onValueChange={(v) => handleUpdate(index, { equipment_id: v })}
                        disabled={disabled}
                    >
                        <SelectTrigger className="h-9 flex-1">
                            <SelectValue placeholder="Chọn thiết bị" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableEquipment
                            .filter(
                                (eq) =>
                                eq.id === item.equipment_id ||
                                !value.some((v) => v.equipment_id === eq.id)
                            )
                            .map((eq) => (
                                <SelectItem key={eq.id} value={eq.id}>
                                {eq.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(index)}
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Inputs Row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Bắt đầu dùng (phút thứ)</Label>
                        <div className="relative">
                            <Input
                                type="number"
                                min={0}
                                max={serviceDuration - 5}
                                step={5}
                                value={item.start_delay}
                                onChange={(e) => handleUpdate(index, { start_delay: Number(e.target.value) })}
                                disabled={disabled}
                                className="h-9"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">phút</div>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">Thời lượng dùng</Label>
                        <div className="relative">
                            <Input
                                type="number"
                                min={5}
                                max={serviceDuration}
                                step={5}
                                value={item.usage_duration}
                                onChange={(e) => handleUpdate(index, { usage_duration: Number(e.target.value) })}
                                disabled={disabled}
                                className="h-9"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">phút</div>
                        </div>
                    </div>
                </div>

                {/* Minimal Visual Bar */}
                <div className="mt-1 pt-2 border-t border-dashed">
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden relative">
                         <div
                            className={cn("absolute h-full rounded-full transition-all", colorClass, isOverflow && "bg-destructive")}
                            style={{
                                left: `${leftPct}%`,
                                width: `${widthPct}%`
                            }}
                         />
                    </div>
                    <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                        <span>0p</span>
                        <span>{item.start_delay}p - {endTime}p</span>
                        <span className={isOverflow ? "text-destructive font-medium" : ""}>
                            Tổng: {serviceDuration}p
                        </span>
                    </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
