"use client"

import { Button } from "@/shared/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { KeyRound, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Staff } from "../../types"
import { DeleteStaffDialog } from "./delete-staff-dialog"

interface StaffActionsProps {
  staff: Staff
}

export function StaffActions({ staff }: StaffActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    // In a real app, this would call an API
    console.log("Deleting staff:", staff.id)
    setShowDeleteDialog(false)
    toast.success("Đã xóa nhân viên thành công", {
      description: `Nhân viên ${staff.name} đã bị xóa khỏi hệ thống.`,
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
          <DropdownMenuItem>
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
    </>
  )
}
