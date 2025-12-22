"use client";



import { showToast } from "@/shared/ui/sonner";
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
import type { CalendarEvent } from "../../model/types";



interface CancelDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}



const CANCELLATION_POLICY = {
  freeHours: 2,
  lateFee: 50,
};



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
            <XCircle className="h-5 w-5 text-warning" />
            Xác nhận hủy lịch hẹn
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn hủy lịch hẹn này?
          </DialogDescription>
        </DialogHeader>


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
              <User className="size-4 text-muted-foreground" />
              <span>{event.appointment.customerName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="size-4" />
              <span>{dateStr}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="size-4" />
              <span>{timeRange}</span>
            </div>
          </div>


          <div className="p-3 rounded-lg border space-y-2">
            <div className="text-sm font-medium">📋 Chính sách hủy:</div>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Hủy trước {CANCELLATION_POLICY.freeHours} giờ: <span className="text-success font-medium">Miễn phí</span></li>
              <li>• Hủy trong {CANCELLATION_POLICY.freeHours} giờ: <span className="text-warning font-medium">Phí {CANCELLATION_POLICY.lateFee}%</span></li>
            </ul>
          </div>


          {isLateCancel && (
            <div className={cn(
              "flex items-start gap-3 p-3 rounded-lg",
              "bg-warning/10 border border-warning/20"
            )}>
              <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <div className="font-medium text-warning-foreground">
                  Cảnh báo: Hủy sát giờ
                </div>
                <div className="text-muted-foreground">
                  Bạn đang hủy trong vòng {CANCELLATION_POLICY.freeHours} giờ trước giờ hẹn.
                  {hoursUntilStart > 0
                    ? ` Còn ${hoursUntilStart} giờ nữa là đến giờ hẹn.`
                    : " Lịch hẹn đã quá giờ."
                  }
                </div>
              </div>
            </div>
          )}


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
