"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/ui/alert-dialog"
import { Staff } from "../../types"

interface DeleteStaffDialogProps {
  staff: Staff | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function DeleteStaffDialog({
  staff,
  open,
  onOpenChange,
  onConfirm,
}: DeleteStaffDialogProps) {
  if (!staff) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa nhân viên này?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Tài khoản của nhân viên <strong>{staff.user.full_name}</strong> ({staff.user.email}) sẽ bị xóa vĩnh viễn khỏi hệ thống.
            <br /><br />
            Lưu ý: Các lịch làm việc đã phân công cho nhân viên này trong tương lai cũng sẽ bị hủy bỏ.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Xóa nhân viên
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
