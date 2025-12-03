"use client"

import { Skill } from "@/features/services/types"
import { deleteStaff } from "@/features/staff/actions"
import { Button } from "@/shared/ui/button"
import { showToast } from "@/shared/ui/custom/sonner"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { KeyRound, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
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
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Mở menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setShowEditDialog(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>Chỉnh sửa hồ sơ</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <KeyRound className="mr-2 h-4 w-4" />
            <span>Đổi mật khẩu</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Xóa nhân viên</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
