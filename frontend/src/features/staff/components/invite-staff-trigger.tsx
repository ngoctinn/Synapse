"use client"

import { Skill } from "@/features/services"
import { Button } from "@/shared/ui/button"
import { Mail } from "lucide-react"
import { useState } from "react"
import { StaffSheet } from "./staff-sheet"

interface InviteStaffModalProps {
  skills: Skill[]
}

export function InviteStaffTrigger({ skills }: InviteStaffModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        size="sm"
        className="text-xs transition-all hover:scale-[1.02] shadow-sm"
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
  )
}
