"use client";

import { Resource, RoomType } from "@/features/resources";
import { Service, Skill } from "../types";
import { ServiceSheet } from "./service-sheet";

interface EditServiceDialogProps {
  service: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableSkills: Skill[];
  availableRoomTypes: RoomType[];
  availableEquipment: Resource[];
}

export function EditServiceDialog({
  service,
  open,
  onOpenChange,
  availableSkills,
  availableRoomTypes,
  availableEquipment,
}: EditServiceDialogProps) {
  return (
    <ServiceSheet
      mode="update"
      initialData={service}
      open={open}
      onOpenChange={onOpenChange}
      availableSkills={availableSkills}
      availableRoomTypes={availableRoomTypes}
      availableEquipment={availableEquipment}
    />
  );
}
