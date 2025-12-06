'use client';

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { DayScheduleRow } from "./day-schedule-row";
import { ExceptionsViewManager } from "./exceptions-view-manager";
import { DAY_LABELS } from "../model/mocks";
import { OperatingHoursConfig, DaySchedule, ExceptionDate, DayOfWeek } from "../model/types";
import { Save, RotateCcw, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { motion } from "framer-motion";
import { updateOperatingHours } from "../actions";

interface OperatingHoursFormProps {
  initialConfig: OperatingHoursConfig;
}

export function OperatingHoursForm({ initialConfig }: OperatingHoursFormProps) {
  const [config, setConfig] = useState<OperatingHoursConfig>(initialConfig);
  const [isDirty, setIsDirty] = useState(false);
  const [copySourceDay, setCopySourceDay] = useState<DayOfWeek | null>(null);
  const [isPending, startTransition] = useTransition();

  // Reset internal state if server data changes
  useEffect(() => {
    setConfig(initialConfig);
    setIsDirty(false);
  }, [initialConfig]);

  // Keyboard shortcut for Save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isDirty && !isPending) {
          handleSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirty, isPending]);

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

  const handleRemoveException = (ids: string | string[]) => {
    const idsToRemove = Array.isArray(ids) ? ids : [ids];
    setConfig({ ...config, exceptions: config.exceptions.filter(e => !idsToRemove.includes(e.id)) });
    setIsDirty(true);
    toast.success(idsToRemove.length > 1 ? `Đã xóa ${idsToRemove.length} mục` : "Đã xóa ngày ngoại lệ");
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
    startTransition(async () => {
      const result = await updateOperatingHours(config);
      if (result.success) {
        setIsDirty(false);
        toast.success(result.message);
      } else {
        toast.error("Đã có lỗi xảy ra khi lưu cấu hình");
      }
    });
  };

  const handleReset = () => {
    setConfig(initialConfig);
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
    <Tabs defaultValue="schedule" className="flex flex-col flex-1 w-full gap-0">
      {/* Sticky Header - Standardized with Services Page */}
      <div className="sticky top-0 z-40 px-4 py-2 bg-background border-b flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">
        <TabsList className="h-9 bg-muted/50 p-1 w-full md:w-auto justify-start">
          <TabsTrigger value="schedule" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Tiêu chuẩn</TabsTrigger>
          <TabsTrigger value="exceptions" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Ngoại lệ</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-3">
          <div className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 flex items-center gap-2",
            isDirty 
              ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800" 
              : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
          )}>
            <span className="relative flex h-2 w-2">
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
                  disabled={!isDirty || isPending} 
                  className="h-9 px-4"
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
                  disabled={!isDirty || isPending} 
                  className={cn(
                    "h-9 px-6 transition-all duration-300",
                    isDirty && "animate-pulse-subtle"
                  )}
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isPending ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Lưu cấu hình (Ctrl+S)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      <TabsContent value="schedule" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out p-6">
        <div className="space-y-6">          
            <Card className="border shadow-sm rounded-xl">
            <CardHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                <div className="space-y-1">
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
            <CardContent className="p-6 pt-0">
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
        </div>
      </TabsContent>
      
      <TabsContent value="exceptions" className="animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out p-6">
        <ExceptionsViewManager
          exceptions={config.exceptions}
          onAddExceptions={handleAddExceptions}
          onRemoveException={handleRemoveException}
        />
      </TabsContent>
    </Tabs>
  );
}
