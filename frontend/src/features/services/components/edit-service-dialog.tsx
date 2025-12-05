"use client";

import { Equipment } from "@/features/equipment/model/types";
import { RoomType } from "@/features/resources/model/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog";
import { Service, Skill } from "../types";
import { ServiceForm } from "./service-form";

interface EditServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
  availableSkills: Skill[];
  availableRoomTypes: RoomType[];
  availableEquipment: Equipment[];
}

export function EditServiceDialog({
  open,
  onOpenChange,
  service,
  availableSkills,
  availableRoomTypes,
  availableEquipment
}: EditServiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl max-h-[90vh] overflow-y-auto duration-300">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa dịch vụ</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin dịch vụ và kỹ năng.
          </DialogDescription>
        </DialogHeader>
        <ServiceForm
          initialData={service}
          availableSkills={availableSkills}
          availableRoomTypes={availableRoomTypes}
          availableEquipment={availableEquipment}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
