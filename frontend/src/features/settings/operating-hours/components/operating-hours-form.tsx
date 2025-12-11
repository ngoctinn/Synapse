'use client';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/shared/ui/card";
import { SettingsHeader } from "@/shared/ui/custom/settings-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateOperatingHours } from "../actions";
import { OPERATING_HOURS_UI } from "../constants";
import { DAY_LABELS } from "../model/mocks";
import { DayOfWeek, DaySchedule, ExceptionDate, OperatingHoursConfig } from "../model/types";
import { copyScheduleToAllDays, copyScheduleToTargetDay } from "../utils/schedule-utils";
import { DayScheduleRow } from "./day-schedule-row";
import { ExceptionsViewManager } from "./exceptions-view-manager";

interface OperatingHoursFormProps {
  initialConfig: OperatingHoursConfig;
}

export function OperatingHoursForm({ initialConfig }: OperatingHoursFormProps) {
  const [config, setConfig] = useState<OperatingHoursConfig>(initialConfig);
  const [isDirty, setIsDirty] = useState(false);
  const [copySourceDay, setCopySourceDay] = useState<DayOfWeek | null>(null);
  const [isPending, startTransition] = useTransition();
  const [pasteConfirmOpen, setPasteConfirmOpen] = useState(false);

  // Reset internal state if server data changes
  // Reset internal state if server data changes
  useEffect(() => {
    setConfig(initialConfig);
    setIsDirty(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialConfig]);

  // Save handler defined before usage in effect
  const handleSave = () => {
    startTransition(async () => {
      const result = await updateOperatingHours(config);
      if (result.success) {
        setIsDirty(false);
        toast.success(result.message);
      } else {
        toast.error(OPERATING_HOURS_UI.SAVE_ERROR);
      }
    });
  };

  // Keyboard shortcut for Save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        /**
         * Checks if there are unsaved changes (isDirty) and no pending save operation (isPending).
         * If both conditions are met, it triggers the save function (handleSave).
         */
        if (isDirty && !isPending) {
          handleSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirty, isPending, config]);

  const handleScheduleChange = (index: number, newSchedule: DaySchedule) => {
    const newDefaultSchedule = [...config.defaultSchedule];
    newDefaultSchedule[index] = newSchedule;
    setConfig({ ...config, defaultSchedule: newDefaultSchedule });
    setIsDirty(true);
  };

  const handleAddExceptions = (newExceptions: ExceptionDate[]) => {
    setConfig(prev => ({ ...prev, exceptions: [...prev.exceptions, ...newExceptions] }));
    setIsDirty(true);
    toast.success(OPERATING_HOURS_UI.ADD_EXCEPTION_SUCCESS(newExceptions.length));
  };

  const handleRemoveException = (ids: string | string[]) => {
    const idsToRemove = Array.isArray(ids) ? ids : [ids];
    setConfig({ ...config, exceptions: config.exceptions.filter(e => !idsToRemove.includes(e.id)) });
    setIsDirty(true);
    toast.success(OPERATING_HOURS_UI.REMOVE_EXCEPTION_SUCCESS(idsToRemove.length));
  };

  const handlePasteToAll = () => {
    setPasteConfirmOpen(true);
  };

  const confirmPasteToAll = () => {
    if (!copySourceDay) return;

    const newSchedule = copyScheduleToAllDays(config.defaultSchedule, copySourceDay);
    if (!newSchedule) return;

    setConfig({ ...config, defaultSchedule: newSchedule });
    setIsDirty(true);
    toast.success(OPERATING_HOURS_UI.PASTE_SUCCESS_ALL(DAY_LABELS[copySourceDay]));
    setCopySourceDay(null);
    setPasteConfirmOpen(false);
  };

  const handleCopy = (day: DayOfWeek) => {
    setCopySourceDay(day);
    toast.info(OPERATING_HOURS_UI.COPY_INFO(DAY_LABELS[day]));
  };

  const handlePaste = (targetDay: DayOfWeek) => {
    if (!copySourceDay) return;

    const newDefaultSchedule = copyScheduleToTargetDay(config.defaultSchedule, copySourceDay, targetDay);
    if (!newDefaultSchedule) return;

    setConfig({ ...config, defaultSchedule: newDefaultSchedule });
    setIsDirty(true);
    toast.success(OPERATING_HOURS_UI.PASTE_SUCCESS_SINGLE(DAY_LABELS[copySourceDay], DAY_LABELS[targetDay]));
  };

  const handleCancelCopy = () => {
    setCopySourceDay(null);
  };

  const handleReset = () => {
    setConfig(initialConfig);
    setIsDirty(false);
    setCopySourceDay(null);
    toast.info(OPERATING_HOURS_UI.RESET);
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
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex bg-muted/50 p-1">
          <TabsTrigger value="schedule" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 transition-all duration-200">{OPERATING_HOURS_UI.STANDARD_TAB}</TabsTrigger>
          <TabsTrigger value="exceptions" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 transition-all duration-200">{OPERATING_HOURS_UI.EXCEPTIONS_TAB}</TabsTrigger>
        </TabsList>
      </SettingsHeader>

      <TabsContent value="schedule" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out p-4 sm:p-6 overflow-y-auto">
        <div className="space-y-6">
            <Card className="border shadow-sm rounded-xl">
            <CardHeader className="px-4 pt-6 pb-4 sm:px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                    <CardDescription className="text-sm text-muted-foreground">
                    {OPERATING_HOURS_UI.DESCRIPTION_TITLE}
                    </CardDescription>
                </div>
                {copySourceDay && (
                    <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-right-8 duration-300 bg-primary/5 px-3 py-2 rounded-lg border border-primary/10 w-full sm:w-auto">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {OPERATING_HOURS_UI.FROM_LABEL} <span className="font-bold text-primary">{DAY_LABELS[copySourceDay]}</span>
                    </span>
                    <div className="h-4 w-px bg-border hidden sm:block" />
                    <div className="flex items-center gap-2 flex-1 sm:flex-none justify-end">
                    <TooltipProvider>
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="secondary" size="sm" onClick={handlePasteToAll}>
                            <Copy className="w-3 h-3 mr-1.5" />
                            {OPERATING_HOURS_UI.COPY_TO_ALL}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{OPERATING_HOURS_UI.COPY_TOOLTIP}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    <Button variant="ghost" size="sm" onClick={handleCancelCopy}>
                        {OPERATING_HOURS_UI.CANCEL}
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

      <AlertDialog open={pasteConfirmOpen} onOpenChange={setPasteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận áp dụng tất cả?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ ghi đè lịch làm việc của tất cả các ngày khác bằng lịch của ngày {copySourceDay ? DAY_LABELS[copySourceDay] : ''}.
              Dữ liệu cũ sẽ bị mất.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPasteToAll}>Xác nhận ghi đè</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  );
}
