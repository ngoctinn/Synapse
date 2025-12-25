"use client";

import { Resource, BedType } from "@/features/resources";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Skill } from "../model/types";
import { ServiceSheet } from "./service-sheet";

interface CreateServiceWizardProps {
  availableSkills: Skill[];
  availableBedTypes: BedType[];
  availableEquipment: Resource[];
}

export function CreateServiceWizard({
  availableSkills,
  availableBedTypes,
  availableEquipment,
}: CreateServiceWizardProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        className="text-xs shadow-sm transition-all hover:scale-[1.02]"
        onClick={() => setOpen(true)}
        startContent={<Plus className="h-3.5 w-3.5" />}
      >
        Tạo dịch vụ
      </Button>

      <ServiceSheet
        mode="create"
        open={open}
        onOpenChange={setOpen}
        availableSkills={availableSkills}
        availableBedTypes={availableBedTypes}
        availableEquipment={availableEquipment}
      />
    </>
  );
}
