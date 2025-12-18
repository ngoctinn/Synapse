"use client";

/**
 * WeeklySchedule - Component quản lý lịch làm việc 7 ngày
 * Tham chiếu: docs/research/operating-hours-uxui.md - Section 4.1
 */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  showToast,
} from "@/shared/ui";
import { Copy, X } from "lucide-react";
import { useCallback, useState } from "react";
import { DayRow } from "./day-row";
import { DAY_LABELS, DayOfWeek, DaySchedule, OperatingHoursConfig } from "./types";

interface WeeklyScheduleProps {
  config: OperatingHoursConfig;
  onConfigChange: (config: OperatingHoursConfig) => void;
}

export function WeeklySchedule({ config, onConfigChange }: WeeklyScheduleProps) {
  const [copySourceDay, setCopySourceDay] = useState<DayOfWeek | null>(null);
  const [pasteToAllOpen, setPasteToAllOpen] = useState(false);

  // Handle single day change
  const handleDayChange = useCallback((index: number, updatedDay: DaySchedule) => {
    const newSchedule = [...config.weeklySchedule];
    newSchedule[index] = updatedDay;
    onConfigChange({ ...config, weeklySchedule: newSchedule });
  }, [config, onConfigChange]);

  // Copy a day's schedule
  const handleCopy = useCallback((dayOfWeek: DayOfWeek) => {
    setCopySourceDay(dayOfWeek);
  }, []);

  // Paste to a specific day
  const handlePaste = useCallback((targetIndex: number) => {
    if (copySourceDay === null) return;

    const sourceDay = config.weeklySchedule.find(d => d.dayOfWeek === copySourceDay);
    if (!sourceDay) return;

    const targetDay = config.weeklySchedule[targetIndex];
    const newSchedule = [...config.weeklySchedule];
    newSchedule[targetIndex] = {
      ...targetDay,
      isOpen: sourceDay.isOpen,
      timeSlots: [...sourceDay.timeSlots],
    };

    onConfigChange({ ...config, weeklySchedule: newSchedule });
    showToast.success(`Đã dán lịch từ ${DAY_LABELS[copySourceDay]} sang ${targetDay.label}`);
  }, [copySourceDay, config, onConfigChange]);

  // Paste to all days
  const handlePasteToAll = useCallback(() => {
    if (copySourceDay === null) return;

    const sourceDay = config.weeklySchedule.find(d => d.dayOfWeek === copySourceDay);
    if (!sourceDay) return;

    const newSchedule = config.weeklySchedule.map(day => {
      if (day.dayOfWeek === copySourceDay) return day;
      return {
        ...day,
        isOpen: sourceDay.isOpen,
        timeSlots: [...sourceDay.timeSlots],
      };
    });

    onConfigChange({ ...config, weeklySchedule: newSchedule });
    showToast.success(`Đã áp dụng lịch từ ${DAY_LABELS[copySourceDay]} cho tất cả các ngày`);
    setCopySourceDay(null);
    setPasteToAllOpen(false);
  }, [copySourceDay, config, onConfigChange]);

  // Cancel copy mode
  const handleCancelCopy = useCallback(() => {
    setCopySourceDay(null);
  }, []);

  return (
    <>
      <div className="space-y-4 relative">
        {/* Copy Mode Indicator - Sticky Top */}
        {copySourceDay !== null && (
          <div className="sticky-alert-top">
            <div className="flex items-center gap-2">
              <Copy className="size-4" />
              <span className="text-sm font-medium">
                Đang sao chép từ <span className="font-bold underline decoration-primary/50 underline-offset-2">{DAY_LABELS[copySourceDay]}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="default" // Primary action
                size="sm"
                onClick={() => setPasteToAllOpen(true)}
                className="h-8 text-xs shadow-none"
              >
                Áp dụng tất cả
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelCopy}
                className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/20"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {config.weeklySchedule.map((day, index) => (
          <DayRow
            key={day.dayOfWeek}
            day={day}
            onChange={(updated) => handleDayChange(index, updated)}
            onCopy={() => handleCopy(day.dayOfWeek)}
            onPaste={
              copySourceDay !== null && copySourceDay !== day.dayOfWeek
                ? () => handlePaste(index)
                : undefined
            }
            onCancelCopy={handleCancelCopy}
            isCopySource={copySourceDay === day.dayOfWeek}
            isPasteTarget={copySourceDay !== null && copySourceDay !== day.dayOfWeek}
          />
        ))}
      </div>

      {/* Confirm dialog for paste to all */}
      <AlertDialog open={pasteToAllOpen} onOpenChange={setPasteToAllOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Áp dụng cho tất cả các ngày?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ ghi đè lịch làm việc của tất cả các ngày khác bằng lịch của ngày {copySourceDay ? DAY_LABELS[copySourceDay] : ""}. Dữ liệu cũ sẽ bị mất.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handlePasteToAll}>
              Xác nhận ghi đè
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


