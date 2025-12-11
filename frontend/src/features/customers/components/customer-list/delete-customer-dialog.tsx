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
import { Loader2 } from "lucide-react"
import { Customer } from "../../model/types"

interface DeleteCustomerDialogProps {
  customer: Customer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isDeleting?: boolean
}

export function DeleteCustomerDialog({
  customer,
  open,
  onOpenChange,
  onConfirm,
  isDeleting = false,
}: DeleteCustomerDialogProps) {
  if (!customer) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn có chắc chắn muốn xóa khách hàng này?</AlertDialogTitle>
          <AlertDialogDescription>
            Hành động này không thể hoàn tác. Hồ sơ khách hàng <strong>{customer.full_name}</strong> và toàn bộ lịch sử (lịch hẹn, điểm thưởng) sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {isDeleting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xóa...</>
            ) : (
              "Xóa khách hàng"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
