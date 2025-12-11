"use client"

import { deleteCustomer } from "@/features/customers/actions"
import { Customer } from "@/features/customers/model/types"
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
import { Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { DeleteCustomerDialog } from "./customer-list/delete-customer-dialog"

interface CustomerActionsProps {
  customer: Customer
  onEdit: () => void
}

export function CustomerActions({ customer, onEdit }: CustomerActionsProps) {
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteCustomer(customer.id)
        showToast.success("Đã xóa khách hàng", `Đã xóa khách hàng ${customer.full_name}`)
        setShowDeleteDialog(false)
        router.refresh()
      } catch (error) {
        showToast.error("Không thể xóa khách hàng", "Vui lòng thử lại sau")
      }
    })
  }

  return (
    <>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>Tác vụ</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.id)}>
            Sao chép ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onEdit}>
            <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
            >
            <Trash2 className="mr-2 h-4 w-4" /> Xóa khách hàng
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>

        <DeleteCustomerDialog
            customer={customer}
            open={showDeleteDialog}
            onOpenChange={setShowDeleteDialog}
            onConfirm={handleDelete}
            isDeleting={isDeleting}
        />
    </>
  )
}
