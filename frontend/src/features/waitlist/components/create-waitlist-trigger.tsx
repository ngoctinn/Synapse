"use client";

import { Button } from "@/shared/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { WaitlistSheet } from "./waitlist-sheet";

export function CreateWaitlistTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="h-9">
        <Plus className="mr-2 h-4 w-4" />
        Thêm yêu cầu
      </Button>
      <WaitlistSheet mode="create" open={open} onOpenChange={setOpen} />
    </>
  );
}
