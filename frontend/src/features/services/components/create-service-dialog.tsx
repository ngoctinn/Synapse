"use client";

import { Resource, RoomType } from "@/features/resources";
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
import { Skill } from "../types";
import { ServiceForm } from "./service-form";

interface CreateServiceDialogProps {
  availableSkills: Skill[];
  availableRoomTypes: RoomType[];
  availableEquipment: Resource[];
}

export function CreateServiceDialog({
  availableSkills,
  availableRoomTypes,
  availableEquipment
}: CreateServiceDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="text-xs">
          <Plus className="mr-2 h-3.5 w-3.5" /> Thêm dịch vụ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto duration-300">
        <DialogHeader>
          <DialogTitle>Thêm dịch vụ mới</DialogTitle>
          <DialogDescription>
            Tạo dịch vụ mới và gán các kỹ năng yêu cầu.
          </DialogDescription>
        </DialogHeader>
        <ServiceForm
            availableSkills={availableSkills}
            availableRoomTypes={availableRoomTypes}
            availableEquipment={availableEquipment}
            onSuccess={() => setOpen(false)}
            variant="dialog"
        />
      </DialogContent>
    </Dialog>
  );
}
