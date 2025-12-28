"use client";

import { ResourceGroup } from "@/features/resources";
import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ServiceCategory, Skill } from "../model/types";
import { ServiceSheet } from "./service-sheet";

interface CreateServiceTriggerProps {
  availableSkills: Skill[];
  availableCategories: ServiceCategory[];
  availableResourceGroups: ResourceGroup[];
}

export function CreateServiceTrigger({
  availableSkills,
  availableCategories,
  availableResourceGroups,
}: CreateServiceTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="text-xs shadow-sm transition-all hover:scale-[1.02]"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 size-3.5" />
        Thêm dịch vụ
      </Button>

      <ServiceSheet
        mode="create"
        open={open}
        onOpenChange={setOpen}
        availableSkills={availableSkills}
        availableCategories={availableCategories}
        availableResourceGroups={availableResourceGroups}
      />
    </>
  );
}
