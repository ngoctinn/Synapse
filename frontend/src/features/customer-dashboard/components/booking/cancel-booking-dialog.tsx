"use client";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/shared/ui/alert-dialog";
import { Button } from "@/shared/ui/button";
import { showToast } from "@/shared/ui/custom/sonner";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { useState, useTransition } from "react";
import { cancelBooking } from "../../actions";
import { Appointment } from "../../types";

interface CancelBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  onSuccess?: () => void;
}

export function CancelBookingDialog({
  open,
  onOpenChange,
  appointment,
  onSuccess,
}: CancelBookingDialogProps) {
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!appointment) return null;

  const handleCancel = () => {
    if (!reason.trim()) {
      showToast.warning("Thiếu thông tin", "Vui lòng nhập lý do hủy");
      return;
    }

    startTransition(async () => {
      const result = await cancelBooking(appointment.id, reason);
      if (result.status === "success") {
        showToast.success("Hủy thành công", result.message);
        onOpenChange(false);
        setReason("");
        onSuccess?.();
      } else {
        showToast.error("Hủy thất bại", result.message || "Không thể hủy lịch hẹn");
      }
    });
  };

  // Check cancellation policy (2 hours)
  const startTime = new Date(appointment.startTime);
  const now = new Date();
  const hoursDifference = (startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  const isLateCancellation = hoursDifference < 2 && hoursDifference > 0;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hủy lịch hẹn</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn hủy lịch hẹn <strong>{appointment.serviceName}</strong> vào lúc{" "}
            <strong>{new Date(appointment.startTime).toLocaleString("vi-VN")}</strong>?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reason">Lý do hủy <span className="text-red-500">*</span></Label>
            <Textarea
              id="reason"
              placeholder="Vui lòng cho biết lý do hủy lịch..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {isLateCancellation && (
            <div className="bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm border border-yellow-200">
              <strong>Lưu ý:</strong> Bạn đang hủy lịch hẹn trước giờ hẹn dưới 2 tiếng.
              Việc này có thể ảnh hưởng đến điểm uy tín của bạn hoặc phát sinh phí hủy theo chính sách.
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Đóng</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isPending || !reason.trim()}
            isLoading={isPending}
          >
            Xác nhận hủy
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
