"use client";

import { createAppointment } from "@/features/appointments/actions";
import { AppointmentForm } from "@/features/appointments/components/sheet/appointment-form";
import { MockService } from "@/features/appointments/mock-data";
import { Appointment, TimelineResource } from "@/features/appointments/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { showToast } from "@/shared/ui/sonner";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";

interface WalkInBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableStaff: TimelineResource[];
  availableResources: TimelineResource[];
  availableServices: MockService[];
  onBookingSuccess: () => void;
}

export function WalkInBookingDialog({
  open,
  onOpenChange,
  availableStaff,
  availableResources,
  availableServices,
  onBookingSuccess,
}: WalkInBookingDialogProps) {
  const [isPending, startTransition] = useTransition();

  const handleCreateAppointment = (appointment: Appointment) => {
    startTransition(async () => {
      const result = await createAppointment({
        customerId: appointment.customerId,
        serviceIds: appointment.items.map(item => item.serviceId),
        staffId: appointment.staffId,
        resourceId: appointment.resourceId,
        startTime: appointment.startTime,
        notes: appointment.notes,
      });

      if (result.status === "success") {
        showToast.success(result.message || "Tạo lịch hẹn thành công");
        onOpenChange(false);
        onBookingSuccess();
      } else {
        showToast.error(result.message || "Không thể tạo lịch hẹn");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Tạo lịch hẹn nhanh (Walk-in)</DialogTitle>
          <DialogDescription>
            Tạo một lịch hẹn mới cho khách hàng vãng lai hoặc đặt nhanh.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <AppointmentForm
            onSubmit={handleCreateAppointment}
            availableStaff={availableStaff}
            availableResources={availableResources}
            availableServices={availableServices}
          />
          {isPending && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
