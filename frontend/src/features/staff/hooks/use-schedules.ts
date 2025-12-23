"use client";

import { format } from "date-fns";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";

import { SCHEDULER_UI } from "../model/constants";
import { getShiftById } from "../model/shifts";
import {
  Schedule,
  ScheduleStatus,
  ScheduleWithShift,
  Shift,
} from "../model/types";

interface UseSchedulesProps {
  initialSchedules: Schedule[];
}

/**
 * Hook quản lý CRUD schedules
 */
export function useSchedules({ initialSchedules }: UseSchedulesProps) {
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);
  const [isPending, startTransition] = useTransition();

  // Enrich schedules with shift data
  const schedulesWithShifts: ScheduleWithShift[] = schedules
    .map((schedule) => {
      const shift = getShiftById(schedule.shiftId);
      if (!shift) return null;
      return { ...schedule, shift };
    })
    .filter((s): s is ScheduleWithShift => s !== null);

  // Add schedule
  const addSchedule = useCallback(
    (staffId: string, date: Date, shift: Shift) => {
      const workDate = format(date, "yyyy-MM-dd");

      startTransition(() => {
        // Check nếu đã có schedule với cùng shift
        const exists = schedules.some(
          (s) =>
            s.staffId === staffId &&
            s.workDate === workDate &&
            s.shiftId === shift.id
        );

        if (exists) {
          toast.error("Ca này đã được phân công");
          return;
        }

        const newSchedule: Schedule = {
          id: `sch_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          staffId,
          shiftId: shift.id,
          workDate,
          status: "DRAFT",
        };

        setSchedules((prev) => [...prev, newSchedule]);
        toast.success(SCHEDULER_UI.SUCCESS_ADD);
      });
    },
    [schedules]
  );

  // Remove schedule
  const removeSchedule = useCallback((scheduleId: string) => {
    startTransition(() => {
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
      toast.success(SCHEDULER_UI.SUCCESS_DELETE);
    });
  }, []);

  // Update schedule status
  const updateScheduleStatus = useCallback(
    (scheduleId: string, status: ScheduleStatus) => {
      startTransition(() => {
        setSchedules((prev) =>
          prev.map((s) => (s.id === scheduleId ? { ...s, status } : s))
        );
        toast.success(SCHEDULER_UI.SUCCESS_UPDATE);
      });
    },
    []
  );

  // Publish schedule (DRAFT → PUBLISHED)
  const publishSchedule = useCallback(
    (scheduleId: string) => {
      updateScheduleStatus(scheduleId, "PUBLISHED");
    },
    [updateScheduleStatus]
  );

  // Batch add schedules (cho selection mode)
  const batchAddSchedules = useCallback(
    (slots: { staffId: string; dateStr: string }[], shift: Shift) => {
      startTransition(() => {
        const newSchedules: Schedule[] = [];

        slots.forEach(({ staffId, dateStr }) => {
          // Check nếu đã có
          const exists = schedules.some(
            (s) =>
              s.staffId === staffId &&
              s.workDate === dateStr &&
              s.shiftId === shift.id
          );

          if (!exists) {
            newSchedules.push({
              id: `sch_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
              staffId,
              shiftId: shift.id,
              workDate: dateStr,
              status: "DRAFT",
            });
          }
        });

        if (newSchedules.length > 0) {
          setSchedules((prev) => [...prev, ...newSchedules]);
          toast.success(`Đã thêm ${newSchedules.length} ca làm việc`);
        }
      });
    },
    [schedules]
  );

  // Batch remove schedules
  const batchRemoveSchedules = useCallback((scheduleIds: string[]) => {
    startTransition(() => {
      setSchedules((prev) => prev.filter((s) => !scheduleIds.includes(s.id)));
      toast.success(`Đã xóa ${scheduleIds.length} ca làm việc`);
    });
  }, []);

  // Batch publish schedules
  const batchPublishSchedules = useCallback((scheduleIds: string[]) => {
    startTransition(() => {
      setSchedules((prev) =>
        prev.map((s) =>
          scheduleIds.includes(s.id)
            ? { ...s, status: "PUBLISHED" as const }
            : s
        )
      );
      toast.success(`Đã công bố ${scheduleIds.length} ca làm việc`);
    });
  }, []);

  // Get schedules for a specific cell
  const getSchedulesForCell = useCallback(
    (staffId: string, workDate: string): ScheduleWithShift[] => {
      return schedulesWithShifts.filter(
        (s) => s.staffId === staffId && s.workDate === workDate
      );
    },
    [schedulesWithShifts]
  );

  // Get all draft schedules
  const draftSchedules = schedulesWithShifts.filter(
    (s) => s.status === "DRAFT"
  );

  return {
    // State
    schedules,
    schedulesWithShifts,
    draftSchedules,
    isPending,

    // Single actions
    addSchedule,
    removeSchedule,
    updateScheduleStatus,
    publishSchedule,

    // Batch actions
    batchAddSchedules,
    batchRemoveSchedules,
    batchPublishSchedules,

    // Helpers
    getSchedulesForCell,
  };
}
