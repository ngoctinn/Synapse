"use client"

import { Skill } from "@/features/services/types"
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
      >
        <Mail className="mr-2 h-3.5 w-3.5" />
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
