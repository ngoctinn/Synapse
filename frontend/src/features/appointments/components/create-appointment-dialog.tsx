"use client";

import { Appointment } from "@/features/appointments/types";
import { Button } from "@/shared/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/shared/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { AppointmentForm } from "./appointment-form";

interface CreateAppointmentDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultDate?: Date;
    defaultResourceId?: string;
    onSubmit?: (data: any) => void;
}

export function CreateAppointmentDialog({
    open: controlledOpen,
    onOpenChange: setControlledOpen,
    defaultDate,
    defaultResourceId,
    onSubmit
}: CreateAppointmentDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = setControlledOpen || setInternalOpen;

  const handleSuccess = (appointment: Partial<Appointment>) => {
    if (onSubmit) {
        onSubmit(appointment);
    }
    setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>

        {!controlledOpen && (
            <Button>
            <Plus className="mr-2 h-4 w-4" /> Tạo lịch hẹn
            </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
          <div className="p-6 pb-4 border-b bg-muted/10">
            <DialogHeader>
            <DialogTitle className="font-serif text-xl">Tạo lịch hẹn mới</DialogTitle>
            <DialogDescription>
                Điền thông tin bên dưới để tạo lịch hẹn mới cho khách hàng.
            </DialogDescription>
            </DialogHeader>
          </div>
          <div className="p-6">
            <AppointmentForm
                defaultDate={defaultDate}
                defaultResourceId={defaultResourceId}
                onSuccess={handleSuccess}
                onCancel={() => setOpen(false)}
            />
          </div>
      </DialogContent>
    </Dialog>
  );
}
