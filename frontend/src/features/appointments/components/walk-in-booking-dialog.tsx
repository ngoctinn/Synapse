"use client";

import { createAppointment } from "@/features/appointments/actions";
import { AppointmentForm } from "@/features/appointments/components/sheet/appointment-form";
import { Appointment, TimelineResource } from "@/features/appointments/types";
import { MockService } from "@/features/appointments/mock-data";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { showToast } from "@/shared/ui/custom/sonner";
import { Loader2 } from "lucide-react";
import * as React from "react";
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
        serviceIds: [appointment.serviceId],
        staffId: appointment.staffId,
        resourceId: appointment.resourceId,
        startTime: appointment.startTime,
        notes: appointment.notes,
      });

      if (result.status === "success") {
        showToast.success(result.message);
        onOpenChange(false);
        onBookingSuccess();
      } else {
        showToast.error(result.message || "Không thể tạo lịch hẹn");
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Tạo lịch hẹn nhanh (Walk-in)</AlertDialogTitle>
          <AlertDialogDescription>
            Tạo một lịch hẹn mới cho khách hàng vãng lai hoặc đặt nhanh.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="relative">
          <AppointmentForm
            onSubmit={handleCreateAppointment}
            onCancel={() => onOpenChange(false)}
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
      </AlertDialogContent>
    </AlertDialog>
  );
}
