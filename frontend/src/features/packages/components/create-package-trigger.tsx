"use client";

import { Button } from "@/shared/ui";
import { Plus } from "lucide-react";
import { useState } from "react";
import { PackageSheet } from "./package-sheet";

export function CreatePackageTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Tạo gói mới
      </Button>
      <PackageSheet mode="create" open={open} onOpenChange={setOpen} />
    </>
  );
}
