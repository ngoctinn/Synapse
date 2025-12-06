"use client";

import { Resource, RoomType } from "@/features/resources";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import * as React from "react";
import { Skill } from "../types";
import { ServiceWizard } from "./service-wizard";

interface CreateServiceWizardProps {
  availableSkills: Skill[];
  availableRoomTypes: RoomType[];
  availableEquipment: Resource[];
}

/**
 * Wrapper component cho ServiceWizard ở chế độ Create
 * Bao gồm trigger button và quản lý dialog state
 */
export function CreateServiceWizard({
  availableSkills,
  availableRoomTypes,
  availableEquipment,
}: CreateServiceWizardProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button size="sm" className="text-xs" onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-3.5 w-3.5" /> Thêm dịch vụ
      </Button>

      <ServiceWizard
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
