"use client"

import { Button } from "@/shared/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { ResourceGroup } from "../types"
import { ResourceSheet } from "./resource-sheet"

export function AddResourceTrigger({ groups }: { groups: ResourceGroup[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        size="sm"
        className="text-xs transition-all hover:scale-[1.02] shadow-sm"
        onClick={() => setOpen(true)}
      >
        <Plus className="mr-2 h-3.5 w-3.5" />
        Thêm tài nguyên
      </Button>

      <ResourceSheet
        open={open}
        onOpenChange={setOpen}
        mode="create"
        groups={groups}
      />
    </>
  )
}
