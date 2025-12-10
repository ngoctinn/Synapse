"use client"

import { Button } from "@/shared/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { CustomerSheet } from "./customer-sheet"

export function CreateCustomerTrigger() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="shadow-sm">
        <Plus className="mr-2 h-4 w-4" />
        Thêm khách hàng
      </Button>

      <CustomerSheet
        mode="create"
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
