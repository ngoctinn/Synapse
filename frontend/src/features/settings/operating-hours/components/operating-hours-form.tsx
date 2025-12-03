'use client';

import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { DayScheduleRow } from "./day-schedule-row";
import { ExceptionsCalendar } from "./exceptions-calendar";
import { MOCK_OPERATING_HOURS } from "../model/mocks";
import { OperatingHoursConfig, DaySchedule, ExceptionDate } from "../model/types";
import { Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function OperatingHoursForm() {
  const [config, setConfig] = useState<OperatingHoursConfig>(MOCK_OPERATING_HOURS);
  const [isDirty, setIsDirty] = useState(false);

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

  const handleSave = () => {
    // Simulate API call
    setTimeout(() => {
      setIsDirty(false);
      toast.success("Đã lưu cấu hình thời gian hoạt động");
    }, 500);
  };

  const handleReset = () => {
    setConfig(MOCK_OPERATING_HOURS);
    setIsDirty(false);
    toast.info("Đã khôi phục cài đặt gốc");
  };

  return (
    <Tabs defaultValue="schedule" className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="schedule">Thời gian hoạt động</TabsTrigger>
          <TabsTrigger value="exceptions">Ngày nghỉ & Ngoại lệ</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleReset} disabled={!isDirty}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Khôi phục
          </Button>
          <Button onClick={handleSave} disabled={!isDirty}>
            <Save className="w-4 h-4 mr-2" />
            Lưu thay đổi
          </Button>
        </div>
      </div>
      
      <TabsContent value="schedule" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Thời gian hoạt động tiêu chuẩn</CardTitle>
            <CardDescription>
              Thiết lập giờ mở cửa mặc định cho từng ngày trong tuần.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {config.defaultSchedule.map((schedule, index) => (
              <DayScheduleRow 
                key={schedule.day} 
                schedule={schedule} 
                onChange={(newSchedule) => handleScheduleChange(index, newSchedule)} 
              />
            ))}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="exceptions">
        <ExceptionsCalendar 
          exceptions={config.exceptions}
          onAddException={handleAddException}
          onRemoveException={handleRemoveException}
        />
      </TabsContent>
    </Tabs>
  );
}
