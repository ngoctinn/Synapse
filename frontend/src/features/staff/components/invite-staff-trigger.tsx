"use client";

import { Skill } from "@/features/services";
import { Button } from "@/shared/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { StaffSheet } from "./staff-sheet";

interface InviteStaffModalProps {
  skills: Skill[];
}

export function InviteStaffTrigger({ skills }: InviteStaffModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="text-xs shadow-sm transition-all hover:scale-[1.02]"
        onClick={() => setOpen(true)}
        startContent={<Mail className="size-3.5" />}
      >
        Mời nhân viên
      </Button>

      <StaffSheet
        open={open}
        onOpenChange={setOpen}
        mode="create"
        skills={skills}
      />
    </>
  );
}
