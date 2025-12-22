"use client";

import { useDeleteAction } from "@/shared/hooks";
import {
    DeleteConfirmDialog,
    DropdownMenuItem,
    DropdownMenuLabel,
    TableRowActions,
} from "@/shared/ui";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { cloneService, deleteService } from "../actions";
import { Service } from "../model/types";

interface ServiceActionsProps {
  service: Service;
  onEdit: () => void;
}

export function ServiceActions({
  service,
  onEdit,
}: ServiceActionsProps) {
  const router = useRouter();
  const [clonePending, startCloneTransition] = useTransition();

  // Sử dụng useDeleteAction hook
  const {
    handleDelete,
    dialogProps,
    openDeleteDialog,
    isPending: deletePending,
  } = useDeleteAction({
    deleteAction: deleteService,
    entityName: "dịch vụ",
    refreshOnSuccess: true,
  });

  const handleClone = async () => {
    startCloneTransition(async () => {
      const result = await cloneService(service.id);
      if (result.status === "success") {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const isPending = deletePending || clonePending;

  return (
    <>
      <TableRowActions
        onEdit={onEdit}
        onDelete={openDeleteDialog}
        disabled={isPending}
        extraActions={
          <>
            <DropdownMenuLabel>Thao tác khác</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleClone} disabled={isPending}>
              <Copy className="mr-2 size-4" />
              <span>Nhân bản</span>
            </DropdownMenuItem>
          </>
        }
      />

      <DeleteConfirmDialog
        {...dialogProps}
        onConfirm={() => handleDelete(service.id)}
        entityName="dịch vụ"
        entityLabel={service.name}
      />
    </>
  );
}
