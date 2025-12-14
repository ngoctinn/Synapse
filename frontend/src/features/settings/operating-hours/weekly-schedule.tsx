"use client";

/**
 * WeeklySchedule - Component quản lý lịch làm việc 7 ngày
 * Tham chiếu: docs/research/operating-hours-uxui.md - Section 4.1
 */

import { Button } from "@/shared/ui/button";
import { ConfirmDialog } from "@/shared/ui/custom/confirm-dialog";
import { showToast } from "@/shared/ui/sonner";
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
      <div className="space-y-4">
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

      {/* Floating Action Bar for Copy Mode */}
      {copySourceDay !== null && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-background/95 backdrop-blur-sm border rounded-xl shadow-lg px-5 py-3 flex items-center gap-4 animate-in slide-in-from-bottom-4 fade-in-0 duration-300">
          <span className="text-sm font-medium whitespace-nowrap">
            Đang sao chép từ{" "}
            <span className="text-primary font-bold">
              {DAY_LABELS[copySourceDay]}
            </span>
          </span>

          <div className="h-5 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setPasteToAllOpen(true)}
              className="h-8 shadow-sm"
            >
              <Copy className="size-3.5 mr-1.5" />
              Áp dụng tất cả
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancelCopy}
              className="h-8 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5 mr-1.5" />
              Hủy
            </Button>
          </div>
        </div>
      )}

      {/* Confirm dialog for paste to all */}
      <ConfirmDialog
        open={pasteToAllOpen}
        onOpenChange={setPasteToAllOpen}
        title="Áp dụng cho tất cả các ngày?"
        description={`Hành động này sẽ ghi đè lịch làm việc của tất cả các ngày khác bằng lịch của ngày ${copySourceDay ? DAY_LABELS[copySourceDay] : ""}. Dữ liệu cũ sẽ bị mất.`}
        variant="warning"
        primaryAction={{
          label: "Xác nhận ghi đè",
          onClick: handlePasteToAll,
        }}
        secondaryAction={{
          label: "Hủy",
          onClick: () => setPasteToAllOpen(false),
        }}
      />
    </>
  );
}


