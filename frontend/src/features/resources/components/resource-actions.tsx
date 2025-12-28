"use client";

import { DeleteConfirmDialog } from "@/shared/components/delete-confirm-dialog";
import { TableRowActions } from "@/shared/components/table-row-actions";
import { useDeleteAction } from "@/shared/hooks";
import {
    DropdownMenuItem,
    DropdownMenuLabel,
} from "@/shared/ui";
import { History } from "lucide-react";
import { deleteResource } from "../actions";
import { Resource } from "../model/types";

interface ResourceActionsProps {
  resource: Resource;
  onEdit: () => void;
}

export function ResourceActions({ resource, onEdit }: ResourceActionsProps) {
  const { handleDelete, dialogProps, openDeleteDialog, isPending } =
    useDeleteAction({
      deleteAction: deleteResource,
      entityName: "tài nguyên",
      refreshOnSuccess: true,
    });

  return (
    <>
      <TableRowActions
        onEdit={onEdit}
        onDelete={openDeleteDialog}
        disabled={isPending}
        extraActions={
          <>
            <DropdownMenuLabel>Thao tác khác</DropdownMenuLabel>
            <DropdownMenuItem>
              <History className="size-4" />
              <span>Lịch sử bảo trì</span>
            </DropdownMenuItem>
          </>
        }
      />

      <DeleteConfirmDialog
        {...dialogProps}
        onConfirm={() => handleDelete(resource.id)}
        entityName="tài nguyên"
        entityLabel={`${resource.name} (${resource.code})`}
      />
    </>
  );
}
