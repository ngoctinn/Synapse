"use client"

import { Skill } from "@/features/services/types"
import { deleteStaff } from "@/features/staff/actions"
import { showToast } from "@/shared/ui/custom/sonner"
import { TableRowActions } from "@/shared/ui/custom/table-row-actions"
import {
    DropdownMenuItem,
    DropdownMenuLabel
} from "@/shared/ui/dropdown-menu"
import { KeyRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { startTransition, useState } from "react"
import { Staff } from "../../model/types"
import { DeleteStaffDialog } from "./delete-staff-dialog"

interface StaffActionsProps {
  staff: Staff
  skills: Skill[]
  onEdit: () => void
}

export function StaffActions({ staff, skills, onEdit }: StaffActionsProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = () => {
    setIsDeleting(true)
    startTransition(async () => {
      const result = await deleteStaff(staff.user_id)
      setIsDeleting(false)
      if (result.success) {
        setShowDeleteDialog(false)
        showToast.success("Thành công", result.message)
        router.refresh()
      } else {
        showToast.error("Lỗi", result.error)
      }
    })
  }

  return (
    <>
      <TableRowActions
        onEdit={onEdit}
        onDelete={() => setShowDeleteDialog(true)}
        extraActions={
          <>
            <DropdownMenuLabel>Thao tác khác</DropdownMenuLabel>
            <DropdownMenuItem>
              <KeyRound className="mr-2 h-4 w-4" />
              <span>Đổi mật khẩu</span>
            </DropdownMenuItem>
          </>
        }
      />

      <DeleteStaffDialog
        staff={staff}
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  )
}
