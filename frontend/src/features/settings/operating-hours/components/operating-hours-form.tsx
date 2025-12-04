'use client';

import { useState, useEffect } from "react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { motion } from "framer-motion";

export function OperatingHoursForm() {
  const [config, setConfig] = useState<OperatingHoursConfig>(MOCK_OPERATING_HOURS);
  const [isDirty, setIsDirty] = useState(false);
  const [copySourceDay, setCopySourceDay] = useState<DayOfWeek | null>(null);

  // Keyboard shortcut for Save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isDirty) {
          handleSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirty]);

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Tabs defaultValue="schedule" className="w-full space-y-8">
      {/* Sticky Header with enhanced Glassmorphism */}
      <div className="sticky top-0 z-50 -mx-6 px-6 py-4 bg-background/80 backdrop-blur-md border-b flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
        <TabsList className="grid grid-cols-2 w-full max-w-[400px] h-10 p-1 bg-muted/50 rounded-full border border-border/50">
          <TabsTrigger 
            value="schedule" 
            className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
          >
            Thời gian hoạt động
          </TabsTrigger>
          <TabsTrigger 
            value="exceptions" 
            className="rounded-full data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm transition-all duration-300"
          >
            Ngày nghỉ & Ngoại lệ
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-3">
          <div className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 flex items-center gap-2 shadow-sm",
            isDirty 
              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800" 
              : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          )}>
            <span className={cn("relative flex h-2 w-2")}>
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isDirty ? "bg-amber-500" : "bg-green-500")}></span>
              <span className={cn("relative inline-flex rounded-full h-2 w-2", isDirty ? "bg-amber-500" : "bg-green-500")}></span>
            </span>
            {isDirty ? "Chưa lưu thay đổi" : "Đã đồng bộ"}
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  onClick={handleReset} 
                  disabled={!isDirty} 
                  className="h-9 px-4 hover:bg-muted/50 transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Khôi phục
                </Button>
              </TooltipTrigger>
              <TooltipContent>Khôi phục về cài đặt gốc</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={handleSave} 
                  disabled={!isDirty} 
                  className={cn(
                    "h-9 px-6 shadow-md hover:shadow-lg transition-all duration-300",
                    isDirty && "animate-pulse-subtle"
                  )}
                >
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </Button>
              </TooltipTrigger>
              <TooltipContent>Lưu cấu hình (Ctrl+S)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <TabsContent value="schedule" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out">
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0 pt-0 pb-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Lịch làm việc tiêu chuẩn</CardTitle>
                <CardDescription className="text-base">
                  Thiết lập giờ mở cửa mặc định cho từng ngày trong tuần.
                </CardDescription>
              </div>
              {copySourceDay && (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-8 duration-300 bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
                  <span className="text-sm text-muted-foreground">
                    Đang sao chép từ <span className="font-bold text-primary">{DAY_LABELS[copySourceDay]}</span>
                  </span>
                  <div className="h-4 w-px bg-border" />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="secondary" size="sm" onClick={handlePasteToAll} className="h-7 text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 border-none shadow-none">
                          <Copy className="w-3 h-3 mr-1.5" />
                          Áp dụng tất cả
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Áp dụng cấu hình này cho tất cả các ngày</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button variant="ghost" size="sm" onClick={handleCancelCopy} className="h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                    Hủy
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0 space-y-4">
            <motion.div 
              className="grid gap-4"
              variants={container}
              initial="hidden"
              animate="show"
            >
            {config.defaultSchedule.map((schedule, index) => (
              <motion.div key={schedule.day} variants={item}>
                <DayScheduleRow 
                  schedule={schedule} 
                  onChange={(newSchedule) => handleScheduleChange(index, newSchedule)}
                  onCopy={() => handleCopy(schedule.day)}
                  onPaste={() => handlePaste(schedule.day)}
                  onCancelCopy={handleCancelCopy}
                  isCopying={copySourceDay === schedule.day}
                  isPasteTarget={copySourceDay !== null && copySourceDay !== schedule.day}
                />
              </motion.div>
            ))}
            </motion.div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="exceptions" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out">
        <ExceptionsCalendar 
          exceptions={config.exceptions}
          onAddExceptions={handleAddExceptions}
          onRemoveException={handleRemoveException}
        />
      </TabsContent>
    </Tabs>
  );
}
