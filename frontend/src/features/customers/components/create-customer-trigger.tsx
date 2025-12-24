"use client";

import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CustomerSheet } from "./customer-sheet";

export function CreateCustomerTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="text-xs shadow-sm transition-all hover:scale-[1.02]"
        onClick={() => setOpen(true)}
        startContent={<Plus className="h-3.5 w-3.5" />}
      >
        Thêm khách hàng
      </Button>

      <CustomerSheet mode="create" open={open} onOpenChange={setOpen} />
    </>
  );
}
