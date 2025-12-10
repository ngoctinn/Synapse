'use client';

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { DayScheduleRow } from "./day-schedule-row";
import { ExceptionsViewManager } from "./exceptions-view-manager";
import { DAY_LABELS } from "../model/mocks";
import { OperatingHoursConfig, DaySchedule, ExceptionDate, DayOfWeek } from "../model/types";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { motion } from "framer-motion";
import { updateOperatingHours } from "../actions";
import { SettingsHeader } from "@/shared/ui/custom/settings-header";

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
    <Tabs defaultValue="schedule" className="flex flex-col flex-1 w-full gap-0 h-full overflow-hidden">
      <SettingsHeader 
        isDirty={isDirty} 
        isPending={isPending} 
        onSave={handleSave} 
        onReset={handleReset}
      >
        <TabsList className="h-9 bg-muted/50 p-1 w-full md:w-auto grid grid-cols-2 md:flex md:justify-start">
          <TabsTrigger value="schedule" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 transition-all duration-200">Tiêu chuẩn</TabsTrigger>
          <TabsTrigger value="exceptions" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 transition-all duration-200">Ngoại lệ</TabsTrigger>
        </TabsList>
      </SettingsHeader>
      
      <TabsContent value="schedule" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out p-4 sm:p-6 overflow-y-auto">
        <div className="space-y-6">          
            <Card className="border shadow-sm rounded-xl">
            <CardHeader className="px-4 pt-6 pb-4 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <CardDescription className="text-sm text-muted-foreground">
                    Thiết lập giờ mở cửa mặc định cho từng ngày trong tuần.
                    </CardDescription>
                </div>
                {copySourceDay && (
                    <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-right-8 duration-300 bg-primary/5 px-3 py-2 rounded-lg border border-primary/10 w-full sm:w-auto">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        Từ: <span className="font-bold text-primary">{DAY_LABELS[copySourceDay]}</span>
                    </span>
                    <div className="h-4 w-px bg-border hidden sm:block" />
                    <div className="flex items-center gap-2 flex-1 sm:flex-none justify-end">
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
                    </div>
                )}
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
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
      
      <TabsContent value="exceptions" className="flex flex-col flex-1 min-h-0 overflow-hidden animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out">
        <ExceptionsViewManager
          exceptions={config.exceptions}
          onAddExceptions={handleAddExceptions}
          onRemoveException={handleRemoveException}
        />
      </TabsContent>
    </Tabs>
  );
}
