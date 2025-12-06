"use client";

import { Resource, RoomType } from "@/features/resources";
import { Service, Skill } from "../types";
import { ServiceWizard } from "./service-wizard";

interface EditServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
  availableSkills: Skill[];
  availableRoomTypes: RoomType[];
  availableEquipment: Resource[];
}

/**
 * Wrapper component cho ServiceWizard ở chế độ Edit
 * Nhận service data để pre-populate form
 */
export function EditServiceDialog({
  open,
  onOpenChange,
  service,
  availableSkills,
  availableRoomTypes,
  availableEquipment
}: EditServiceDialogProps) {
  return (
    <ServiceWizard
      mode="edit"
      initialData={service}
      open={open}
      onOpenChange={onOpenChange}
      availableSkills={availableSkills}
      availableRoomTypes={availableRoomTypes}
      availableEquipment={availableEquipment}
    />
  );
}
