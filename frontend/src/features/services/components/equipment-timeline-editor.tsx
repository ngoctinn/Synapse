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
import { EquipmentUsage } from "../types";

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
    return availableEquipment.find((eq) => eq.id === id)?.name || "Không xác định";
  };


  const unusedEquipment = availableEquipment.filter(
    (eq) => !value.some((v) => v.equipment_id === eq.id)
  );

  return (
    <div className="space-y-4">

      <div className="relative bg-muted/30 rounded-xl p-4 border">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium">Timeline sử dụng thiết bị</Label>
          <span className="text-xs text-muted-foreground">
            Tổng: {serviceDuration} phút
          </span>
        </div>


        <div className="relative h-6 mb-2">
          <div className="absolute inset-x-0 flex justify-between text-[10px] text-muted-foreground">
            <span>0</span>
            <span>{Math.round(serviceDuration / 4)}p</span>
            <span>{Math.round(serviceDuration / 2)}p</span>
            <span>{Math.round((serviceDuration * 3) / 4)}p</span>
            <span>{serviceDuration}p</span>
          </div>
        </div>


        <div className="relative h-auto min-h-[60px] bg-muted/20 rounded-lg overflow-hidden border">

          <div className="absolute inset-0 flex">
            {[0, 25, 50, 75, 100].map((pct) => (
              <div
                key={pct}
                className="absolute h-full border-l border-border/30"
                style={{ left: `${pct}%` }}
              />
            ))}
          </div>


          <TooltipProvider>
            {value.length === 0 ? (
              <div className="flex items-center justify-center h-[60px] text-sm text-muted-foreground">
                Chưa có thiết bị nào được cấu hình
              </div>
            ) : (
              <div className="relative py-2 space-y-1.5">
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
                            "relative h-7 rounded-md flex items-center px-2 text-[11px] font-medium text-white shadow-sm cursor-pointer transition-all",
                            "hover:ring-2 hover:ring-white/50 hover:shadow-md",
                            colorClass,
                            isOverflow && "ring-2 ring-destructive"
                          )}
                          style={{
                            marginLeft: `${leftPct}%`,
                            width: `${Math.min(widthPct, 100 - leftPct)}%`,
                            minWidth: "60px",
                          }}
                        >
                          <GripVertical className="w-3 h-3 mr-1 opacity-50 shrink-0" />
                          <span className="truncate">{getEquipmentName(item.equipment_id)}</span>
                          {isOverflow && (
                            <span className="ml-auto text-[9px] bg-destructive/80 px-1 rounded">
                              Vượt quá!
                            </span>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-medium">{getEquipmentName(item.equipment_id)}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.start_offset}p → {endTime}p ({item.duration} phút)
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
          <Card key={index} className="p-3 bg-muted/10">
            <div className="flex items-start gap-3">

              <div
                className={cn(
                  "w-3 h-3 rounded-full mt-2.5 shrink-0",
                  COLORS[index % COLORS.length]
                )}
              />


              <div className="flex-1 space-y-2">
                <Select
                  value={item.equipment_id}
                  onValueChange={(v) => handleUpdate(index, { equipment_id: v })}
                  disabled={disabled}
                >
                  <SelectTrigger className="h-9">
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
                    <Label className="text-[10px] text-muted-foreground uppercase">
                      Bắt đầu (phút)
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      max={serviceDuration - 5}
                      step={5}
                      value={item.start_offset}
                      onChange={(e) =>
                        handleUpdate(index, { start_offset: Number(e.target.value) })
                      }
                      disabled={disabled}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-[10px] text-muted-foreground uppercase">
                      Thời lượng (phút)
                    </Label>
                    <Input
                      type="number"
                      min={5}
                      max={serviceDuration}
                      step={5}
                      value={item.duration}
                      onChange={(e) =>
                        handleUpdate(index, { duration: Number(e.target.value) })
                      }
                      disabled={disabled}
                      className="h-8 text-sm"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 mt-4 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(index)}
                    disabled={disabled}
                    aria-label="Xóa thiết bị"
                  >
                    <X className="w-4 h-4" />
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
            <Plus className="w-4 h-4 mr-2" />
            Thêm thiết bị ({unusedEquipment.length} còn lại)
          </Button>
        )}
      </div>


      {availableEquipment.length === 0 && (
        <div className="text-center py-6 text-muted-foreground text-sm">
          <Trash2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>Chưa có thiết bị nào trong hệ thống</p>
          <p className="text-xs">Vui lòng thêm thiết bị trong Quản lý Tài nguyên</p>
        </div>
      )}
    </div>
  );
}
