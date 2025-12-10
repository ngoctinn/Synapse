"use client"

import { deleteCustomer } from "@/features/customers/actions"
import { Customer } from "@/features/customers/types"
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
import { useTransition } from "react"

interface CustomerActionsProps {
  customer: Customer
  onEdit: () => void
}

export function CustomerActions({ customer, onEdit }: CustomerActionsProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteCustomer(customer.user_id)
        showToast.success("Đã xóa khách hàng")
      } catch (error) {
        showToast.error("Không thể xóa khách hàng")
      }
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Tác vụ</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.user_id)}>
          Sao chép ID
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={handleDelete}
          disabled={isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" /> {isPending ? "Đang xóa..." : "Xóa"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
