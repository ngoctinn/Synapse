'use client';

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { DayScheduleRow } from "./day-schedule-row";
import { ExceptionsCalendar } from "./exceptions-calendar";
import { MOCK_OPERATING_HOURS, DAY_LABELS } from "../model/mocks";
import { OperatingHoursConfig, DaySchedule, ExceptionDate, DayOfWeek } from "../model/types";
import { Save, RotateCcw, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";

export function OperatingHoursForm() {
  const [config, setConfig] = useState<OperatingHoursConfig>(MOCK_OPERATING_HOURS);
  const [isDirty, setIsDirty] = useState(false);
  const [copySourceDay, setCopySourceDay] = useState<DayOfWeek | null>(null);

  const handleScheduleChange = (index: number, newSchedule: DaySchedule) => {
    const newDefaultSchedule = [...config.defaultSchedule];
    newDefaultSchedule[index] = newSchedule;
    setConfig({ ...config, defaultSchedule: newDefaultSchedule });
    setIsDirty(true);
  };

  const handleAddExceptions = (newExceptions: ExceptionDate[]) => {
    setConfig(prev => ({ ...prev, exceptions: [...prev.exceptions, ...newExceptions] }));
    setIsDirty(true);
    toast.success(`Đã thêm ${newExceptions.length} ngày ngoại lệ mới`);
  };

  const handleRemoveException = (id: string) => {
    setConfig({ ...config, exceptions: config.exceptions.filter(e => e.id !== id) });
    setIsDirty(true);
    toast.success("Đã xóa ngày ngoại lệ");
  };

  const handlePasteToAll = () => {
    if (!copySourceDay) return;
    const sourceSchedule = config.defaultSchedule.find(s => s.day === copySourceDay);
    if (!sourceSchedule) return;

    const newSchedule = config.defaultSchedule.map((day) => {
      if (day.day === copySourceDay) return day; 
      return {
        ...day,
        isOpen: sourceSchedule.isOpen,
        timeSlots: sourceSchedule.timeSlots.map(slot => ({ ...slot })),
      };
    });
    setConfig({ ...config, defaultSchedule: newSchedule });
    setIsDirty(true);
    toast.success(`Đã áp dụng cấu hình ${DAY_LABELS[copySourceDay]} cho tất cả các ngày`);
    setCopySourceDay(null);
  };

  const handleCopy = (day: DayOfWeek) => {
    setCopySourceDay(day);
    toast.info(`Đã chọn ${DAY_LABELS[day]}. Chọn ngày khác để dán hoặc áp dụng cho tất cả.`);
  };

  const handlePaste = (targetDay: DayOfWeek) => {
    if (!copySourceDay) return;

    const sourceSchedule = config.defaultSchedule.find(s => s.day === copySourceDay);
    if (!sourceSchedule) return;

    const newDefaultSchedule = config.defaultSchedule.map(schedule => {
      if (schedule.day === targetDay) {
        return {
          ...schedule,
          isOpen: sourceSchedule.isOpen,
          timeSlots: sourceSchedule.timeSlots.map(slot => ({ ...slot })),
        };
      }
      return schedule;
    });

    setConfig({ ...config, defaultSchedule: newDefaultSchedule });
    setIsDirty(true);
    toast.success(`Đã dán cấu hình từ ${DAY_LABELS[copySourceDay]} sang ${DAY_LABELS[targetDay]}`);
  };

  const handleCancelCopy = () => {
    setCopySourceDay(null);
  };

  const handleSave = () => {
    // Mô phỏng gọi API
    setTimeout(() => {
      setIsDirty(false);
      toast.success("Đã lưu cấu hình thời gian hoạt động");
    }, 500);
  };

  const handleReset = () => {
    setConfig(MOCK_OPERATING_HOURS);
    setIsDirty(false);
    setCopySourceDay(null);
    toast.info("Đã khôi phục cài đặt gốc");
  };

  return (
    <Tabs defaultValue="schedule" className="w-full space-y-6">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-b flex flex-col md:flex-row items-center justify-between gap-4">
        <TabsList className="grid grid-cols-2 w-full max-w-[400px] p-1 bg-muted/50 rounded-full">
          <TabsTrigger 
            value="schedule" 
            className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            Thời gian hoạt động
          </TabsTrigger>
          <TabsTrigger 
            value="exceptions" 
            className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
          >
            Ngày nghỉ & Ngoại lệ
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-3">
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border transition-colors flex items-center gap-1.5",
            isDirty 
              ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" 
              : "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
          )}>
            <div className={cn("w-1.5 h-1.5 rounded-full", isDirty ? "bg-amber-500" : "bg-green-500")} />
            {isDirty ? "Chưa lưu thay đổi" : "Đã đồng bộ"}
          </div>
          <Button variant="outline" onClick={handleReset} disabled={!isDirty} className="h-9">
            <RotateCcw className="w-4 h-4 mr-2" />
            Khôi phục
          </Button>
          <Button onClick={handleSave} disabled={!isDirty} className="h-9 shadow-md hover:shadow-lg transition-all">
            <Save className="w-4 h-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>
      </div>
      
      <TabsContent value="schedule" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
        <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Lịch làm việc tiêu chuẩn</CardTitle>
                <CardDescription>
                  Thiết lập giờ mở cửa mặc định cho từng ngày trong tuần.
                </CardDescription>
              </div>
              {copySourceDay && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5">
                  <span className="text-sm text-muted-foreground">
                    Đang sao chép từ <span className="font-medium text-foreground">{DAY_LABELS[copySourceDay]}</span>
                  </span>
                  <Button variant="secondary" size="sm" onClick={handlePasteToAll} className="text-primary">
                    <Copy className="w-4 h-4 mr-2" />
                    Áp dụng cho tất cả
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleCancelCopy} className="text-destructive hover:bg-destructive/10">
                    Hủy
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-3">
            {config.defaultSchedule.map((schedule, index) => (
              <DayScheduleRow 
                key={schedule.day} 
                schedule={schedule} 
                onChange={(newSchedule) => handleScheduleChange(index, newSchedule)}
                onCopy={() => handleCopy(schedule.day)}
                onPaste={() => handlePaste(schedule.day)}
                onCancelCopy={handleCancelCopy}
                isCopying={copySourceDay === schedule.day}
                isPasteTarget={copySourceDay !== null && copySourceDay !== schedule.day}
              />
            ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="exceptions" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
        <ExceptionsCalendar 
          exceptions={config.exceptions}
          onAddExceptions={handleAddExceptions}
          onRemoveException={handleRemoveException}
        />
      </TabsContent>
    </Tabs>
  );
}
