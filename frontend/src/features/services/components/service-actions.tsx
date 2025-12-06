"use client"

import { Resource, RoomType } from "@/features/resources"
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
import { TableRowActions } from "@/shared/ui/custom/table-row-actions"
import {
    DropdownMenuItem,
    DropdownMenuLabel
} from "@/shared/ui/dropdown-menu"
import { Copy } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { cloneService, deleteService } from "../actions"
import { Service, Skill } from "../types"
import { EditServiceDialog } from "./edit-service-dialog"

interface ServiceActionsProps {
  service: Service
  availableSkills: Skill[]
  availableRoomTypes: RoomType[]
  availableEquipment: Resource[]
}

export function ServiceActions({
  service,
  availableSkills,
  availableRoomTypes,
  availableEquipment
}: ServiceActionsProps) {
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
      <TableRowActions
        onEdit={() => setOpenEdit(true)}
        onDelete={() => setShowDeleteDialog(true)}
        disabled={isPending}
        extraActions={
          <>
            <DropdownMenuLabel>Thao tác khác</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={handleClone}
              disabled={isPending}
            >
              <Copy className="mr-2 h-4 w-4" />
              <span>Nhân bản</span>
            </DropdownMenuItem>
          </>
        }
      />

      <EditServiceDialog
        open={openEdit}
        onOpenChange={setOpenEdit}
        service={service}
        availableSkills={availableSkills}
        availableRoomTypes={availableRoomTypes}
        availableEquipment={availableEquipment}
      />

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
