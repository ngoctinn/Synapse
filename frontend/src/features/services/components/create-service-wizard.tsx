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
      <Button size="sm" className="text-xs transition-all hover:scale-[1.02] shadow-sm" onClick={() => setOpen(true)} startContent={<Plus className="mr-2 h-3.5 w-3.5" />}>
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
