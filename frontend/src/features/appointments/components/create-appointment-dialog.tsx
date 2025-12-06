"use client";

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

export function CreateAppointmentDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tạo lịch hẹn
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo lịch hẹn mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để tạo lịch hẹn mới cho khách hàng.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center p-8 border-2 border-dashed rounded-lg text-muted-foreground">
            Form tạo lịch hẹn đang được phát triển
        </div>
      </DialogContent>
    </Dialog>
  );
}
