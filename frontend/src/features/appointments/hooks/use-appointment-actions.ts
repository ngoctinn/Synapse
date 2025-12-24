"use client";

import { ActionResponse } from "@/shared/lib/action-response";
import { showToast } from "@/shared/ui/sonner";
import { useCallback, useTransition } from "react";
import {
  cancelAppointment,
  checkInAppointment,
  deleteAppointment,
  markNoShow,
} from "../actions";
import type { Appointment, AppointmentStatus, CalendarEvent } from "../model/types";
import { OptimisticAction } from "./use-appointment-events";

interface UseAppointmentActionsProps {
  events: CalendarEvent[];
  refreshEvents: () => void;
  setSelectedBookingForReview: (id: string | null) => void;
  setIsSheetOpen: (open: boolean) => void;
  setIsDeleteOpen: (open: boolean) => void;
  setIsCancelOpen: (open: boolean) => void;
  addOptimisticEvent: (action: OptimisticAction) => void;

  // Dependency Injection: Actions from other features
  createInvoice: (bookingId: string) => Promise<ActionResponse<unknown>>;
  getInvoice: (bookingId: string) => Promise<ActionResponse<unknown>>;
  getBookingReview: (bookingId: string) => Promise<ActionResponse<unknown>>;
}

/**
 * Hook to manage appointment-related actions (save, delete, check-in, etc.)
 */
export function useAppointmentActions({
  events,
  refreshEvents,
  setSelectedBookingForReview,
  setIsSheetOpen,
  setIsDeleteOpen,
  setIsCancelOpen,
  addOptimisticEvent,
  createInvoice,
  getInvoice,
  getBookingReview,
}: UseAppointmentActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [isCancelling, startCancelTransition] = useTransition();

  const internalReviewNeeded = useCallback(
    async (bookingId: string) => {
      const booking = events.find((e) => e.id === bookingId)?.appointment;
      if (!booking || booking.status !== "COMPLETED") return;

      const invoiceRes = await getInvoice(bookingId);
      const invoice = invoiceRes.data as { status: string } | null;
      if (invoiceRes.status !== "success" || !invoice || invoice.status !== "PAID") {
        return;
      }

      const reviewRes = await getBookingReview(bookingId);
      if (!(reviewRes.status === "success" && reviewRes.data)) {
        setSelectedBookingForReview(bookingId);
      }
    },
    [events, setSelectedBookingForReview, getInvoice, getBookingReview]
  );

  const handleSaveAppointment = (appointment: Appointment) => {
    setIsSheetOpen(false);
    refreshEvents();
    if (appointment.status === "COMPLETED") {
      internalReviewNeeded(appointment.id);
    }
  };

  const wrapAction = useCallback(
    (
      fn: (id: string) => Promise<ActionResponse<Appointment | undefined>>,
      successMsg: string,
      errorMsg: string,
      targetStatus: AppointmentStatus
    ) => {
      return async (event: CalendarEvent) => {
        if (!event.id) return;

        // Perform optimistic update
        addOptimisticEvent({ type: "update_status", id: event.id, status: targetStatus });

        startTransition(async () => {
          const res = await fn(event.id!);
          if (res.status === "success") {
            showToast.success(res.message || successMsg);
            refreshEvents();
          } else {
            showToast.error(res.message || errorMsg);
          }
        });
      };
    },
    [refreshEvents, addOptimisticEvent]
  );

  const handleConfirmDelete = (actionEvent: CalendarEvent | null) => {
    if (!actionEvent?.id) return;

    // Optimistic delete
    addOptimisticEvent({ type: "delete", id: actionEvent.id });
    setIsDeleteOpen(false);

    startDeleteTransition(async () => {
      const res = await deleteAppointment(actionEvent.id!);
      if (res.status === "success") {
        showToast.success(res.message || "Xóa lịch hẹn thành công");
        refreshEvents();
      } else {
        showToast.error(res.message || "Không thể xóa lịch hẹn");
        // State reverts automatically here too
      }
    });
  };

  const handleConfirmCancel = (actionEvent: CalendarEvent | null, reason?: string) => {
    if (!actionEvent?.id) return;

    // Optimistic cancel
    addOptimisticEvent({ type: "update_status", id: actionEvent.id, status: "CANCELLED" });
    setIsCancelOpen(false);

    startCancelTransition(async () => {
      const res = await cancelAppointment(actionEvent.id!, reason);
      if (res.status === "success") {
        showToast.success(res.message || "Đã hủy lịch hẹn");
        refreshEvents();
      } else {
        showToast.error(res.message || "Không thể hủy lịch hẹn");
      }
    });
  };

  const handleCreateInvoice = useCallback(async (bookingId: string) => {
    const res = await createInvoice(bookingId);
    if (res.status === "success" && res.data) {
      showToast.success(res.message || "Tạo hóa đơn thành công");
      return res.data as any; // Cast to any for DI compatibility
    }
    showToast.error(res.message || "Không thể tạo hóa đơn");
    return null;
  }, [createInvoice]);


  return {
    isPending,
    isDeleting,
    isCancelling,
    handleSaveAppointment,
    handleConfirmDelete,
    handleConfirmCancel,
    handleCreateInvoice,
    handleReviewNeeded: internalReviewNeeded,
    onCheckIn: wrapAction(checkInAppointment, "Check-in thành công", "Không thể check-in", "IN_PROGRESS"),
    onNoShow: wrapAction(markNoShow, "Đã đánh dấu No-show", "Không thể đánh dấu No-show", "NO_SHOW"),
  };
}
