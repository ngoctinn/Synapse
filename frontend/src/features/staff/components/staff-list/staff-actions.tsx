"use client";

import { deleteStaff } from "@/features/staff/actions";
import { useDeleteAction } from "@/shared/hooks";
import {
  DeleteConfirmDialog,
  DropdownMenuItem,
  DropdownMenuLabel,
  TableRowActions,
} from "@/shared/ui";
import { KeyRound } from "lucide-react";
import { Staff } from "../../model/types";

interface StaffActionsProps {
  staff: Staff;
  onEdit: () => void;
}

export function StaffActions({ staff, onEdit }: StaffActionsProps) {
  const { handleDelete, dialogProps, openDeleteDialog } = useDeleteAction({
    deleteAction: deleteStaff,
    entityName: "nhân viên",
    refreshOnSuccess: true,
  });

  return (
    <>
      <TableRowActions
        onEdit={onEdit}
        onDelete={openDeleteDialog}
        extraActions={
          <>
            <DropdownMenuLabel>Thao tác khác</DropdownMenuLabel>
            <DropdownMenuItem>
              <KeyRound className="mr-2 size-4" />
              <span>Đổi mật khẩu</span>
            </DropdownMenuItem>
          </>
        }
      />

      <DeleteConfirmDialog
        {...dialogProps}
        onConfirm={() => handleDelete(staff.user_id)}
        entityName="nhân viên"
        entityLabel={staff.user.full_name ?? undefined}
      />
    </>
  );
}
