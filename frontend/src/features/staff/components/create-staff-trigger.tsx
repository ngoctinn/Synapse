"use client"

import { Skill } from "@/features/services"
import { Button } from "@/shared/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { StaffSheet } from "./staff-sheet"

interface CreateStaffTriggerProps {
  skills: Skill[]
}

export function CreateStaffTrigger({ skills }: CreateStaffTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        size="sm"
        className="text-xs transition-all hover:scale-[1.02]"
        onClick={() => setOpen(true)}
        startContent={<Plus className="size-3.5" />}
      >
        Thêm nhân viên
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
