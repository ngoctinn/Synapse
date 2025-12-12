"use client";

/**
 * CancelDialog - Dialog xác nhận hủy lịch hẹn với chính sách
 *
 * Features:
 * - Hiển thị thông tin cuộc hẹn
 * - Cảnh báo chính sách hủy (trước 2 giờ miễn phí)
 * - Input lý do hủy (optional)
 * - Loading state khi submit
 */

import { showToast } from "@/shared/ui/custom/sonner";
import { differenceInHours, format } from "date-fns";
import { vi } from "date-fns/locale";
import { AlertTriangle, Calendar, Clock, User, XCircle } from "lucide-react";
import { useState, useTransition } from "react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Textarea } from "@/shared/ui/textarea";

import { cancelAppointment } from "../../actions";
import type { CalendarEvent } from "../../types";

// ============================================
// TYPES
// ============================================

interface CancelDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// ============================================
// CONSTANTS
// ============================================

const CANCELLATION_POLICY = {
  freeHours: 2, // Hủy trước 2 giờ miễn phí
  lateFee: 50, // Phí 50% nếu hủy sát giờ
};

// ============================================
// COMPONENT
// ============================================

export function CancelDialog({
  event,
  open,
  onOpenChange,
  onSuccess,
}: CancelDialogProps) {
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!event) return null;

  const hoursUntilStart = differenceInHours(event.start, new Date());
  const isLateCancel = hoursUntilStart < CANCELLATION_POLICY.freeHours;
  const timeRange = `${format(event.start, "HH:mm")} - ${format(event.end, "HH:mm")}`;
  const dateStr = format(event.start, "EEEE, d MMMM yyyy", { locale: vi });

  const handleCancel = () => {
    startTransition(async () => {
      const result = await cancelAppointment(event.id, reason || undefined);

      if (result.status === "success") {
        showToast.success("Hủy thành công", result.message || "Đã hủy lịch hẹn");
        setReason("");
        onOpenChange(false);
        onSuccess?.();
      } else {
        showToast.error("Hủy thất bại", result.message || "Không thể hủy lịch hẹn");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-amber-500" />
            Xác nhận hủy lịch hẹn
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn hủy lịch hẹn này?
          </DialogDescription>
        </DialogHeader>

        {/* Appointment Info */}
        <div className="space-y-3 py-4">
          {/* Service & Customer */}
          <div className="p-3 rounded-lg bg-muted/50 space-y-2">
            <div
              className="font-semibold text-base"
              style={{ color: event.color }}
            >
              {event.appointment.serviceName}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{event.appointment.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{timeRange}</span>
            </div>
          </div>

          {/* Cancellation Policy */}
          <div className="p-3 rounded-lg border space-y-2">
            <div className="text-sm font-medium">📋 Chính sách hủy:</div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Hủy trước {CANCELLATION_POLICY.freeHours} giờ: <span className="text-emerald-600 font-medium">Miễn phí</span></li>
              <li>• Hủy trong {CANCELLATION_POLICY.freeHours} giờ: <span className="text-amber-600 font-medium">Phí {CANCELLATION_POLICY.lateFee}%</span></li>
            </ul>
          </div>

          {/* Late Cancel Warning */}
          {isLateCancel && (
            <div className={cn(
              "flex items-start gap-3 p-3 rounded-lg",
              "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900"
            )}>
              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-amber-800 dark:text-amber-200">
                  Cảnh báo: Hủy sát giờ
                </div>
                <div className="text-amber-700 dark:text-amber-300">
                  Bạn đang hủy trong vòng {CANCELLATION_POLICY.freeHours} giờ trước giờ hẹn.
                  {hoursUntilStart > 0
                    ? ` Còn ${hoursUntilStart} giờ nữa là đến giờ hẹn.`
                    : " Lịch hẹn đã quá giờ."
                  }
                </div>
              </div>
            </div>
          )}

          {/* Reason Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Lý do hủy <span className="text-muted-foreground font-normal">(tùy chọn)</span>
            </label>
            <Textarea
              placeholder="Nhập lý do hủy lịch hẹn..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              disabled={isPending}
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Quay lại
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isPending}
            isLoading={isPending}
          >
            {isPending ? "Đang hủy..." : "Xác nhận hủy"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
