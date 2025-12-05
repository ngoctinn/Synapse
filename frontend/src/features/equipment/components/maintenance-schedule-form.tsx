"use client";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { CalendarIcon, Repeat, Save, X } from "lucide-react";
import * as React from "react";
import { mockEquipment } from "../model/mocks";
import { MaintenanceFrequency, MaintenanceSchedule } from "../model/types";

interface MaintenanceScheduleFormProps {
  initialData?: Partial<MaintenanceSchedule>;
  onSave: (data: Partial<MaintenanceSchedule>) => void;
  onCancel: () => void;
}

export function MaintenanceScheduleForm({
  initialData,
  onSave,
  onCancel,
}: MaintenanceScheduleFormProps) {
  const [formData, setFormData] = React.useState<Partial<MaintenanceSchedule>>(
    initialData || {
      frequency: "monthly",
      interval: 1,
      startDate: new Date().toISOString().split("T")[0],
    }
  );

  const frequencies: { value: MaintenanceFrequency; label: string }[] = [
    { value: "daily", label: "Hàng ngày" },
    { value: "weekly", label: "Hàng tuần" },
    { value: "monthly", label: "Hàng tháng" },
    { value: "yearly", label: "Hàng năm" },
  ];

  const daysOfWeek = [
    { value: 1, label: "T2" },
    { value: 2, label: "T3" },
    { value: 3, label: "T4" },
    { value: 4, label: "T5" },
    { value: 5, label: "T6" },
    { value: 6, label: "T7" },
    { value: 0, label: "CN" },
  ];

  const handleFrequencyChange = (value: MaintenanceFrequency) => {
    setFormData({ ...formData, frequency: value });
  };

  const toggleDayOfWeek = (day: number) => {
    const currentDays = formData.daysOfWeek || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter((d) => d !== day)
      : [...currentDays, day];
    setFormData({ ...formData, daysOfWeek: newDays });
  };

  const getRecurrenceSummary = () => {
    const { frequency, interval, daysOfWeek, dayOfMonth } = formData;
    if (!frequency) return "";

    let summary = `Lặp lại mỗi ${interval} ${
      frequency === "daily"
        ? "ngày"
        : frequency === "weekly"
        ? "tuần"
        : frequency === "monthly"
        ? "tháng"
        : "năm"
    }`;

    if (frequency === "weekly" && daysOfWeek?.length) {
      const days = daysOfWeek
        .map((d) => (d === 0 ? "CN" : `T${d + 1}`))
        .join(", ");
      summary += ` vào ${days}`;
    }

    if (frequency === "monthly" && dayOfMonth) {
      summary += ` vào ngày ${dayOfMonth}`;
    }

    return summary;
  };

  return (
    <div className="space-y-6 p-6 bg-card rounded-xl border shadow-sm">
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-serif font-semibold text-foreground">
          {initialData ? "Cập nhật Lịch Bảo Trì" : "Tạo Lịch Bảo Trì Mới"}
        </h2>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Equipment Selection */}
        <div className="grid gap-2">
          <Label>Thiết bị</Label>
          <Select
            value={formData.equipmentId}
            onValueChange={(val) =>
              setFormData({ ...formData, equipmentId: val })
            }
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Chọn thiết bị..." />
            </SelectTrigger>
            <SelectContent>
              {mockEquipment.map((eq) => (
                <SelectItem key={eq.id} value={eq.id}>
                  {eq.name} ({eq.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Title */}
        <div className="grid gap-2">
          <Label>Tên công việc</Label>
          <Input
            placeholder="VD: Kiểm tra đầu bắn Laser"
            className="h-11"
            value={formData.title || ""}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>

        {/* Recurrence Settings */}
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-dashed border-primary/20">
          <div className="flex items-center gap-2 text-primary font-medium">
            <Repeat className="w-4 h-4" />
            <span>Cấu hình Lặp lại</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Tần suất</Label>
              <div className="flex flex-wrap gap-2">
                {frequencies.map((freq) => (
                  <button
                    key={freq.value}
                    type="button"
                    onClick={() => handleFrequencyChange(freq.value)}
                    className={cn(
                      "px-3 py-1.5 text-sm rounded-full border transition-all",
                      formData.frequency === freq.value
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : "bg-background hover:bg-muted text-muted-foreground border-input"
                    )}
                  >
                    {freq.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Mỗi (Interval)</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  className="w-20 h-9"
                  value={formData.interval}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      interval: parseInt(e.target.value) || 1,
                    })
                  }
                />
                <span className="text-sm text-muted-foreground">
                  {formData.frequency === "daily"
                    ? "ngày"
                    : formData.frequency === "weekly"
                    ? "tuần"
                    : formData.frequency === "monthly"
                    ? "tháng"
                    : "năm"}
                </span>
              </div>
            </div>
          </div>

          {formData.frequency === "weekly" && (
            <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
              <Label>Vào các ngày</Label>
              <div className="flex gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => toggleDayOfWeek(day.value)}
                    className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all border",
                      formData.daysOfWeek?.includes(day.value)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground hover:bg-muted border-input"
                    )}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>
          )}

           {formData.frequency === "monthly" && (
            <div className="grid gap-2 animate-in fade-in slide-in-from-top-2">
               <Label>Vào ngày</Label>
               <div className="flex items-center gap-2">
                 <span className="text-sm text-muted-foreground">Ngày</span>
                 <Input
                    type="number"
                    min={1}
                    max={31}
                    className="w-20 h-9"
                    value={formData.dayOfMonth || 1}
                    onChange={(e) => setFormData({...formData, dayOfMonth: parseInt(e.target.value) || 1})}
                 />
                 <span className="text-sm text-muted-foreground">hàng tháng</span>
               </div>
            </div>
          )}

          <div className="p-3 bg-primary/5 rounded-md text-sm text-primary flex items-start gap-2">
            <CalendarIcon className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{getRecurrenceSummary()}</span>
          </div>
        </div>

        {/* Start Date & Assignee */}
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label>Bắt đầu từ</Label>
            <Input
              type="date"
              className="h-11"
              value={formData.startDate}
              onChange={(e) =>
                setFormData({ ...formData, startDate: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <Label>Giao cho (Tùy chọn)</Label>
            <Select
              value={formData.assignedTo}
              onValueChange={(val) =>
                setFormData({ ...formData, assignedTo: val })
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Chọn nhân viên..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff-1">Nguyễn Văn A</SelectItem>
                <SelectItem value="staff-2">Trần Thị B</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div className="grid gap-2">
          <Label>Mô tả / Ghi chú</Label>
          <Textarea
            placeholder="Nhập hướng dẫn chi tiết..."
            className="min-h-[100px]"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button variant="outline" onClick={onCancel}>
          Hủy bỏ
        </Button>
        <Button onClick={() => onSave(formData)} className="gap-2">
          <Save className="w-4 h-4" />
          Lưu Lịch Trình
        </Button>
      </div>
    </div>
  );
}
