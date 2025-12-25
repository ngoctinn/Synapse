"use client";

import { Resource, BedType } from "@/features/resources";
import { Service, Skill } from "../model/types";
import { ServiceSheet } from "./service-sheet";

interface EditServiceDialogProps {
  service: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableSkills: Skill[];
  availableBedTypes: BedType[];
  availableEquipment: Resource[];
}

export function EditServiceDialog({
  service,
  open,
  onOpenChange,
  availableSkills,
  availableBedTypes,
  availableEquipment,
}: EditServiceDialogProps) {
  return (
    <ServiceSheet
      mode="update"
      initialData={service}
      open={open}
      onOpenChange={onOpenChange}
      availableSkills={availableSkills}
      availableBedTypes={availableBedTypes}
      availableEquipment={availableEquipment}
    />
  );
}
