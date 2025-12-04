'use client';

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { DayScheduleRow } from "./day-schedule-row";
import { ExceptionsCalendar } from "./exceptions-calendar";
import { MOCK_OPERATING_HOURS } from "../model/mocks";
import { OperatingHoursConfig, DaySchedule, ExceptionDate, DayOfWeek } from "../model/types";
import { Save, RotateCcw, Copy } from "lucide-react";
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

  const handleAddException = (exception: ExceptionDate) => {
    setConfig({ ...config, exceptions: [...config.exceptions, exception] });
    setIsDirty(true);
    toast.success("Đã thêm ngày ngoại lệ mới");
  };

  const handleRemoveException = (id: string) => {
    setConfig({ ...config, exceptions: config.exceptions.filter(e => e.id !== id) });
    setIsDirty(true);
    toast.success("Đã xóa ngày ngoại lệ");
  };

  const handleCopyToAll = () => {
    const mondaySchedule = config.defaultSchedule[0]; // Giả sử thứ 2 là phần tử đầu tiên
    const newSchedule = config.defaultSchedule.map((day, index) => {
      if (index === 0) return day; // Giữ nguyên thứ 2
      return {
        ...day,
        isOpen: mondaySchedule.isOpen,
        timeSlots: mondaySchedule.timeSlots.map(slot => ({ ...slot })),
      };
    });
    setConfig({ ...config, defaultSchedule: newSchedule });
    setIsDirty(true);
    toast.success("Đã sao chép cấu hình cho tất cả các ngày");
  };

  const handleCopy = (day: DayOfWeek) => {
    setCopySourceDay(day);
    toast.info("Đã chọn ngày nguồn. Chọn ngày khác để dán.");
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
    toast.success(`Đã dán cấu hình từ ${copySourceDay} sang ${targetDay}`);
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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cấu hình Thời gian</h2>
          <p className="text-muted-foreground">
            Quản lý giờ mở cửa và ngày nghỉ lễ của Spa
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
            isDirty 
              ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800" 
              : "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
          )}>
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

      <Tabs defaultValue="schedule" className="w-full space-y-6">
        <TabsList className="w-full max-w-[400px] grid grid-cols-2 p-1 bg-muted/50 rounded-full">
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
                <Button variant="ghost" size="sm" onClick={handleCopyToAll} className="text-primary hover:text-primary/80 hover:bg-primary/10">
                  <Copy className="w-4 h-4 mr-2" />
                  Sao chép T2 cho tất cả
                </Button>
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
            onAddException={handleAddException}
            onRemoveException={handleRemoveException}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
