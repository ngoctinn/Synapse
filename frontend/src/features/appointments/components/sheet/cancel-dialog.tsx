"use client";

import { differenceInHours, format } from "date-fns";
import { vi } from "date-fns/locale";
import { AlertTriangle, Calendar, Clock, User, XCircle } from "lucide-react";
import { useState } from "react";

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

import type { CalendarEvent } from "../../model/types";

interface CancelDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (event: CalendarEvent, reason?: string) => void;
  isPending?: boolean;
}

const CANCELLATION_POLICY = {
  freeHours: 2,
  lateFee: 50,
};

export function CancelDialog({
  event,
  open,
  onOpenChange,
  onConfirm,
  isPending = false,
}: CancelDialogProps) {
  const [reason, setReason] = useState("");

  if (!event) return null;

  const hoursUntilStart = differenceInHours(event.start, new Date());
  const isLateCancel = hoursUntilStart < CANCELLATION_POLICY.freeHours;
  const timeRange = `${format(event.start, "HH:mm")} - ${format(event.end, "HH:mm")}`;
  const dateStr = format(event.start, "EEEE, d MMMM yyyy", { locale: vi });

  const handleCancel = () => {
    onConfirm(event, reason || undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="text-warning h-5 w-5" />
            Xác nhận hủy lịch hẹn
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn hủy lịch hẹn này?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {/* Service & Customer */}
          <div className="bg-muted/50 space-y-2 rounded-lg p-3">
            <div
              className="text-base font-semibold"
              style={{ color: event.color }}
            >
              {event.appointment.serviceName}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <User className="text-muted-foreground size-4" />
              <span>{event.appointment.customerName}</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Calendar className="size-4" />
              <span>{dateStr}</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Clock className="size-4" />
              <span>{timeRange}</span>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border p-3">
            <div className="text-sm font-medium">📋 Chính sách hủy:</div>
            <ul className="text-muted-foreground ml-4 space-y-1 text-sm">
              <li>
                • Hủy trước {CANCELLATION_POLICY.freeHours} giờ:{" "}
                <span className="text-success font-medium">Miễn phí</span>
              </li>
              <li>
                • Hủy trong {CANCELLATION_POLICY.freeHours} giờ:{" "}
                <span className="text-warning font-medium">
                  Phí {CANCELLATION_POLICY.lateFee}%
                </span>
              </li>
            </ul>
          </div>

          {isLateCancel && (
            <div
              className={cn(
                "flex items-start gap-3 rounded-lg p-3",
                "bg-warning/10 border-warning/20 border"
              )}
            >
              <AlertTriangle className="text-warning mt-0.5 h-5 w-5 flex-shrink-0" />
              <div className="text-sm">
                <div className="text-warning-foreground font-medium">
                  Cảnh báo: Hủy sát giờ
                </div>
                <div className="text-muted-foreground">
                  Bạn đang hủy trong vòng {CANCELLATION_POLICY.freeHours} giờ
                  trước giờ hẹn.
                  {hoursUntilStart > 0
                    ? ` Còn ${hoursUntilStart} giờ nữa là đến giờ hẹn.`
                    : " Lịch hẹn đã quá giờ."}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Lý do hủy{" "}
              <span className="text-muted-foreground font-normal">
                (tùy chọn)
              </span>
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
