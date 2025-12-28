"use client";

import { Service } from "@/features/services";
import { Button } from "@/shared/ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PackageSheet } from "./package-sheet";

interface CreatePackageTriggerProps {
  availableServices: Service[];
}

export function CreatePackageTrigger({
  availableServices,
}: CreatePackageTriggerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Tạo gói mới
      </Button>
      <PackageSheet
        mode="create"
        open={open}
        onOpenChange={setOpen}
        availableServices={availableServices}
      />
    </>
  );
}
