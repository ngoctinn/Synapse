'use client';

import { DeleteConfirmDialog, showToast } from "@/shared/ui";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/shared/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { useState } from "react";
import { OPERATING_HOURS_UI } from "../constants";
import { DAY_LABELS } from "../model/mocks";
import { DayOfWeek, DaySchedule, OperatingHoursConfig } from "../model/types";
import { copyScheduleToAllDays, copyScheduleToTargetDay } from "../utils/schedule-utils";
import { DayScheduleRow } from "./day-schedule-row";

interface ScheduleEditorProps {
  config: OperatingHoursConfig;
  onConfigChange: (newConfig: OperatingHoursConfig) => void;
}

/**
 * Component chỉ chịu trách nhiệm edit lịch làm việc hàng ngày
 * Tách ra từ OperatingHoursForm để đảm bảo Single Responsibility
 */
export function ScheduleEditor({ config, onConfigChange }: ScheduleEditorProps) {
  const [copySourceDay, setCopySourceDay] = useState<DayOfWeek | null>(null);
  const [pasteConfirmOpen, setPasteConfirmOpen] = useState(false);

  const handleScheduleChange = (index: number, newSchedule: DaySchedule) => {
    const newDefaultSchedule = [...config.defaultSchedule];
    newDefaultSchedule[index] = newSchedule;
    onConfigChange({ ...config, defaultSchedule: newDefaultSchedule });
  };

  const handlePasteToAll = () => {
    setPasteConfirmOpen(true);
  };

  const confirmPasteToAll = () => {
    if (!copySourceDay) return;

    const newSchedule = copyScheduleToAllDays(config.defaultSchedule, copySourceDay);
    if (!newSchedule) return;

    onConfigChange({ ...config, defaultSchedule: newSchedule });
    showToast.success(OPERATING_HOURS_UI.PASTE_SUCCESS_ALL(DAY_LABELS[copySourceDay]));
    setCopySourceDay(null);
    setPasteConfirmOpen(false);
  };

  const handleCopy = (day: DayOfWeek) => {
    setCopySourceDay(day);
    showToast.info(OPERATING_HOURS_UI.COPY_INFO(DAY_LABELS[day]));
  };

  const handlePaste = (targetDay: DayOfWeek) => {
    if (!copySourceDay) return;

    const newDefaultSchedule = copyScheduleToTargetDay(config.defaultSchedule, copySourceDay, targetDay);
    if (!newDefaultSchedule) return;

    onConfigChange({ ...config, defaultSchedule: newDefaultSchedule });
    showToast.success(OPERATING_HOURS_UI.PASTE_SUCCESS_SINGLE(DAY_LABELS[copySourceDay], DAY_LABELS[targetDay]));
  };

  const handleCancelCopy = () => {
    setCopySourceDay(null);
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
    <>
      <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out">
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

      <DeleteConfirmDialog
        open={pasteConfirmOpen}
        onOpenChange={setPasteConfirmOpen}
        onConfirm={confirmPasteToAll}
        title="Xác nhận áp dụng tất cả?"
        description={
          <>
            Hành động này sẽ ghi đè lịch làm việc của tất cả các ngày khác bằng lịch của ngày {copySourceDay ? DAY_LABELS[copySourceDay] : ''}.
            Dữ liệu cũ sẽ bị mất.
          </>
        }
        confirmText="Xác nhận ghi đè"
      />
    </>
  );
}
