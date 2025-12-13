"use client";

/**
 * useCalendarDnd - Hook quản lý logic drag and drop cho Calendar
 *
 * Xử lý: di chuyển event, validation, optimistic updates.
 */

import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";

import { checkConflicts, updateAppointmentTime } from "../actions";
import type { CalendarEvent } from "../types";



interface UseCalendarDndOptions {
  /** Callback khi event được di chuyển thành công */
  onMoveSuccess?: (event: CalendarEvent, newStart: Date, newEnd: Date) => void;
  /** Callback khi có lỗi */
  onMoveError?: (error: string) => void;
  /** Có kiểm tra conflict không */
  checkConflictsOnMove?: boolean;
}

interface UseCalendarDndReturn {
  /** Xử lý khi event được thả vào slot mới */
  handleEventMove: (
    eventId: string,
    newStart: Date,
    newEnd: Date
  ) => Promise<void>;
  /** Đang xử lý move */
  isMoving: boolean;
  /** Event đang được kéo */
  draggedEventId: string | null;
  /** Slot đang hover */
  hoveredSlot: { date: Date } | null;
  /** Set slot đang hover (cho preview) */
  setHoveredSlot: (slot: { date: Date } | null) => void;
}



export function useCalendarDnd(
  events: CalendarEvent[],
  options: UseCalendarDndOptions = {}
): UseCalendarDndReturn {
  const {
    onMoveSuccess,
    onMoveError,
    checkConflictsOnMove = true,
  } = options;

  const [isMoving, startTransition] = useTransition();
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [hoveredSlot, setHoveredSlot] = useState<{ date: Date } | null>(null);



  const handleEventMove = useCallback(
    async (eventId: string, newStart: Date, newEnd: Date) => {
      const originalEvent = events.find((e) => e.id === eventId);
      if (!originalEvent) {
        toast.error("Không tìm thấy lịch hẹn");
        return;
      }

      // Validate: không cho phép kéo vào quá khứ
      if (newStart < new Date()) {
        toast.error("Không thể đặt lịch hẹn trong quá khứ");
        onMoveError?.("Không thể đặt lịch hẹn trong quá khứ");
        return;
      }

      startTransition(async () => {
        try {
          if (checkConflictsOnMove) {
            const conflictResult = await checkConflicts(
              originalEvent.staffId,
              newStart,
              newEnd,
              eventId
            );

            if (
              conflictResult.status === "success" &&
              conflictResult.data &&
              conflictResult.data.length > 0
            ) {
              const conflictMessages = conflictResult.data
                .map((c) => c.message)
                .join(", ");
              toast.error(`Xung đột lịch: ${conflictMessages}`);
              onMoveError?.(`Xung đột lịch: ${conflictMessages}`);
              return;
            }
          }

          const result = await updateAppointmentTime(
            eventId,
            newStart,
            newEnd
          );

          if (result.status === "success") {
            toast.success("Đã cập nhật thời gian lịch hẹn");
            onMoveSuccess?.(originalEvent, newStart, newEnd);
          } else {
            toast.error(result.message || "Không thể cập nhật lịch hẹn");
            onMoveError?.(result.message || "Không thể cập nhật lịch hẹn");
          }
        } catch (error) {
          const message = "Đã xảy ra lỗi khi di chuyển lịch hẹn";
          toast.error(message);
          onMoveError?.(message);
        }
      });
    },
    [events, checkConflictsOnMove, onMoveSuccess, onMoveError]
  );

  return {
    handleEventMove,
    isMoving,
    draggedEventId,
    hoveredSlot,
    setHoveredSlot,
  };
}
