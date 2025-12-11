"use client";

import { Resource, RoomType } from "@/features/resources";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Skill } from "../types";
import { ServiceSheet } from "./service-sheet";

interface CreateServiceWizardProps {
  availableSkills: Skill[];
  availableRoomTypes: RoomType[];
  availableEquipment: Resource[];
}

export function CreateServiceWizard({
  availableSkills,
  availableRoomTypes,
  availableEquipment,
}: CreateServiceWizardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} startContent={<Plus className="h-4 w-4" />}>
        Tạo dịch vụ
      </Button>

      <ServiceSheet
        mode="create"
        open={open}
        onOpenChange={setOpen}
        availableSkills={availableSkills}
        availableRoomTypes={availableRoomTypes}
        availableEquipment={availableEquipment}
      />
    </>
  );
}
