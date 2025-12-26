"use client";

import { deleteStaff } from "@/features/staff/actions";
import { useDeleteAction } from "@/shared/hooks";
import {
  DeleteConfirmDialog,
  DropdownMenuItem,
  DropdownMenuLabel,
  TableRowActions,
} from "@/shared/ui";
import { Calendar, KeyRound } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Staff } from "../../model/types";

interface StaffActionsProps {
  staff: Staff;
  onEdit: () => void;
}

export function StaffActions({ staff, onEdit }: StaffActionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleViewSchedule = () => {
    const params = new URLSearchParams(searchParams);
    params.set("view", "scheduling");
    router.push(`${pathname}?${params.toString()}`);
  };

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
            <DropdownMenuItem onClick={handleViewSchedule}>
              <Calendar className="size-4" />
              <span>Xem lịch làm việc</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <KeyRound className="size-4" />
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
