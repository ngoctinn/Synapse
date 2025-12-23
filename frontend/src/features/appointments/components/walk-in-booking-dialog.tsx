"use client";

import { createAppointment } from "@/features/appointments/actions";
import { AppointmentForm } from "@/features/appointments/components/sheet/appointment-form";
import { MockService } from "@/features/appointments/model/mocks";
import {
  Appointment,
  TimelineResource,
} from "@/features/appointments/model/types";
import {
  Dialog,
  DialogContent,
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
        serviceIds: appointment.items.map((item: any) => item.serviceId),
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
      <DialogContent className="gap-0 p-0 sm:max-w-xl">
        <DialogHeader className="shrink-0 space-y-0 border-b px-6 py-4">
          <DialogTitle className="text-lg">
            Tạo lịch hẹn nhanh (Khách vãng lai)
          </DialogTitle>
        </DialogHeader>
        <div className="relative p-6">
          <AppointmentForm
            onSubmit={handleCreateAppointment}
            availableStaff={availableStaff}
            availableResources={availableResources}
            availableServices={availableServices}
          />
          {isPending && (
            <div className="bg-background/80 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
              <Loader2 className="text-primary h-8 w-8 animate-spin" />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
