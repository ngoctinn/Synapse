"use client";

import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { WarrantySheet } from "./warranty-sheet";

export function CreateWarrantyTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        Tạo phiếu mới
      </Button>
      <WarrantySheet mode="create" open={open} onOpenChange={setOpen} />
    </>
  );
}
