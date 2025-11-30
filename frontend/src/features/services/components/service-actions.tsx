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
import { Button } from "@/shared/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/shared/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Copy, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { cloneService, deleteService } from "../actions"
import { Service, Skill } from "../types"
import { ServiceForm } from "./service-form"

interface ServiceActionsProps {
  service: Service
  availableSkills: Skill[]
}

export function ServiceActions({ service, availableSkills }: ServiceActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [openEdit, setOpenEdit] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = async () => {
    startTransition(async () => {
      const result = await deleteService(service.id)
      if (result.success) {
        toast.success("Đã xóa dịch vụ")
        router.refresh()
      } else {
        toast.error(result.message)
      }
      setShowDeleteDialog(false)
    })
  }

  const handleClone = async () => {
    startTransition(async () => {
      const result = await cloneService(service.id)
      if (result.success) {
        toast.success("Đã nhân bản dịch vụ")
        router.refresh()
      } else {
        toast.error(result.message)
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
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={handleClone}
            disabled={isPending}
          >
            <Copy className="mr-2 h-4 w-4" />
            <span>Nhân bản</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenEdit(true)}
          >
            <Edit className="mr-2 h-4 w-4" />
            <span>Chỉnh sửa</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Xóa dịch vụ</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa Dịch vụ</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin dịch vụ và kỹ năng.
            </DialogDescription>
          </DialogHeader>
          <ServiceForm
            initialData={service}
            availableSkills={availableSkills}
            onSuccess={() => setOpenEdit(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ xóa dịch vụ khỏi hệ thống. Bạn không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
              disabled={isPending}
            >
              {isPending ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
