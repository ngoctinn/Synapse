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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { GripVertical, Plus, Trash2, X } from "lucide-react";
import { EquipmentUsage } from "../model/types";

interface EquipmentTimelineEditorProps {
  /** Thời lượng dịch vụ (phút) - dùng để vẽ timeline */
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
  "bg-orange-500",
  "bg-pink-500",
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
        start_offset: 0,
        duration: Math.min(15, serviceDuration),
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

  const getEquipmentName = (id: string) => {
    return (
      availableEquipment.find((eq) => eq.id === id)?.name || "Không xác định"
    );
  };

  const unusedEquipment = availableEquipment.filter(
    (eq) => !value.some((v) => v.equipment_id === eq.id)
  );

  return (
    <div className="space-y-4">
      <div className="bg-muted/30 relative rounded-xl border p-4">
        <div className="mb-3 flex items-center justify-between">
          <Label className="text-sm font-medium">
            Timeline sử dụng thiết bị
          </Label>
          <span className="text-muted-foreground text-xs">
            Tổng: {serviceDuration} phút
          </span>
        </div>

        <div className="relative mb-2 h-6">
          <div className="text-muted-foreground absolute inset-x-0 flex justify-between text-[10px]">
            <span>0</span>
            <span>{Math.round(serviceDuration / 4)}p</span>
            <span>{Math.round(serviceDuration / 2)}p</span>
            <span>{Math.round((serviceDuration * 3) / 4)}p</span>
            <span>{serviceDuration}p</span>
          </div>
        </div>

        <div className="bg-muted/20 relative h-auto min-h-[60px] overflow-hidden rounded-lg border">
          <div className="absolute inset-0 flex">
            {[0, 25, 50, 75, 100].map((pct) => (
              <div
                key={pct}
                className="border-border/30 absolute h-full border-l"
                style={{ left: `${pct}%` }}
              />
            ))}
          </div>

          <TooltipProvider>
            {value.length === 0 ? (
              <div className="text-muted-foreground flex h-[60px] items-center justify-center text-sm">
                Chưa có thiết bị nào được cấu hình
              </div>
            ) : (
              <div className="relative space-y-1.5 py-2">
                {value.map((item, index) => {
                  const leftPct = getPercent(item.start_offset);
                  const widthPct = getPercent(item.duration);
                  const colorClass = COLORS[index % COLORS.length];
                  const endTime = item.start_offset + item.duration;
                  const isOverflow = endTime > serviceDuration;

                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div
                          className={cn(
                            "relative flex h-7 cursor-pointer items-center rounded-lg px-2 text-[11px] font-medium text-white shadow-sm transition-all",
                            "hover:shadow-md hover:ring-2 hover:ring-white/50",
                            colorClass,
                            isOverflow && "ring-destructive ring-2"
                          )}
                          style={{
                            marginLeft: `${leftPct}%`,
                            width: `${Math.min(widthPct, 100 - leftPct)}%`,
                            minWidth: "60px",
                          }}
                        >
                          <GripVertical className="mr-1 h-3 w-3 shrink-0 opacity-50" />
                          <span className="truncate">
                            {getEquipmentName(item.equipment_id)}
                          </span>
                          {isOverflow && (
                            <span className="bg-destructive/80 ml-auto rounded px-1 text-[9px]">
                              Vượt quá!
                            </span>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">
                          {getEquipmentName(item.equipment_id)}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {item.start_offset}p → {endTime}p ({item.duration}{" "}
                          phút)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            )}
          </TooltipProvider>
        </div>
      </div>

      <div className="space-y-3">
        {value.map((item, index) => (
          <Card key={index} className="bg-muted/10 p-3">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "mt-2.5 h-3 w-3 shrink-0 rounded-full",
                  COLORS[index % COLORS.length]
                )}
              />

              <div className="flex-1 space-y-2">
                <Select
                  value={item.equipment_id}
                  onValueChange={(v) =>
                    handleUpdate(index, { equipment_id: v })
                  }
                  disabled={disabled}
                >
                  <SelectTrigger>
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

                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-[10px] uppercase">
                      Bắt đầu (phút)
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      max={serviceDuration - 5}
                      step={5}
                      value={item.start_offset}
                      onChange={(e) =>
                        handleUpdate(index, {
                          start_offset: Number(e.target.value),
                        })
                      }
                      disabled={disabled}
                      size="sm"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-muted-foreground text-[10px] uppercase">
                      Thời lượng (phút)
                    </Label>
                    <Input
                      type="number"
                      min={5}
                      max={serviceDuration}
                      step={5}
                      value={item.duration}
                      onChange={(e) =>
                        handleUpdate(index, {
                          duration: Number(e.target.value),
                        })
                      }
                      disabled={disabled}
                      size="sm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive mt-4 h-9 w-9"
                    onClick={() => handleRemove(index)}
                    disabled={disabled}
                    aria-label="Xóa thiết bị"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {unusedEquipment.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full border-dashed"
            onClick={handleAdd}
            disabled={disabled}
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm thiết bị ({unusedEquipment.length} còn lại)
          </Button>
        )}
      </div>

      {availableEquipment.length === 0 && (
        <div className="text-muted-foreground py-6 text-center text-sm">
          <Trash2 className="mx-auto mb-2 h-8 w-8 opacity-50" />
          <p>Chưa có thiết bị nào trong hệ thống</p>
          <p className="text-xs">
            Vui lòng thêm thiết bị trong Quản lý Tài nguyên
          </p>
        </div>
      )}
    </div>
  );
}
