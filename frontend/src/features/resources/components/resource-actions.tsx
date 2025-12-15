 "use client";

import { useDeleteAction } from "@/shared/hooks";
import {
    DeleteConfirmDialog,
    DropdownMenuItem,
    DropdownMenuLabel,
    TableRowActions,
} from "@/shared/ui";
import { History } from "lucide-react";
import { deleteResource } from "../actions";
import { Resource } from "../types";

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
              <History className="mr-2 size-4" />
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
