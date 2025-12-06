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
import { startTransition, useState } from "react"
import { Staff } from "../../types"
import { DeleteStaffDialog } from "./delete-staff-dialog"
import { EditStaffModal } from "./edit-staff-modal"

interface StaffActionsProps {
  staff: Staff
  skills: Skill[]
}

export function StaffActions({ staff, skills }: StaffActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteStaff(staff.user_id)
      if (result.success) {
        setShowDeleteDialog(false)
        showToast.success("Thành công", result.message)
      } else {
        showToast.error("Lỗi", result.error)
      }
    })
  }

  return (
    <>
      <TableRowActions
        onEdit={() => setShowEditDialog(true)}
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
      />

      <EditStaffModal
        staff={staff}
        skills={skills}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </>
  )
}
