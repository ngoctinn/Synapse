"use client";

import { Resource, RoomType } from "@/features/resources";
import { useDeleteAction } from "@/shared/hooks";
import { DeleteConfirmDialog } from "@/shared/ui/custom/delete-confirm-dialog";
import { TableRowActions } from "@/shared/ui/custom/table-row-actions";
import { DropdownMenuItem, DropdownMenuLabel } from "@/shared/ui/dropdown-menu";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { cloneService, deleteService } from "../actions";
import { Service, Skill } from "../types";
import { EditServiceDialog } from "./edit-service-dialog";

interface ServiceActionsProps {
  service: Service;
  availableSkills: Skill[];
  availableRoomTypes: RoomType[];
  availableEquipment: Resource[];
}

export function ServiceActions({
  service,
  availableSkills,
  availableRoomTypes,
  availableEquipment,
}: ServiceActionsProps) {
  const router = useRouter();
  const [clonePending, startCloneTransition] = useTransition();
  const [openEdit, setOpenEdit] = useState(false);

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
      if (result.success) {
        toast.success("Đã nhân bản dịch vụ");
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
        onEdit={() => setOpenEdit(true)}
        onDelete={openDeleteDialog}
        disabled={isPending}
        extraActions={
          <>
            <DropdownMenuLabel>Thao tác khác</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleClone} disabled={isPending}>
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

      <DeleteConfirmDialog
        {...dialogProps}
        onConfirm={() => handleDelete(service.id)}
        entityName="dịch vụ"
        entityLabel={service.name}
      />
    </>
  );
}
