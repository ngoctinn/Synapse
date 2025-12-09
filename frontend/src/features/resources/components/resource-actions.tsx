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
import { showToast } from "@/shared/ui/custom/sonner"
import { TableRowActions } from "@/shared/ui/custom/table-row-actions"
import {
    DropdownMenuItem,
    DropdownMenuLabel
} from "@/shared/ui/dropdown-menu"
import { History } from "lucide-react"
import { startTransition, useState } from "react"
import { deleteResource } from "../actions"
import { Resource } from "../types"

interface ResourceActionsProps {
  resource: Resource
  onEdit: () => void
}

export function ResourceActions({ resource, onEdit }: ResourceActionsProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteResource(resource.id);
        if (result.success) {
            setShowDeleteDialog(false);
            showToast.success("Thành công", result.message);
        } else {
            showToast.error("Lỗi", result.error || "Không thể xóa");
        }
      } catch (error) {
        showToast.error("Lỗi", "Đã có lỗi xảy ra");
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
              <History className="mr-2 h-4 w-4" />
              <span>Lịch sử bảo trì</span>
            </DropdownMenuItem>
          </>
        }
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tài nguyên sẽ bị xóa vĩnh viễn
              khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
