"use client";

import { TableRowActions } from "@/shared/ui";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteService } from "../actions";
import { Service } from "../model/types";

interface ServiceActionsProps {
  service: Service;
  onEdit: () => void;
}

export function ServiceActions({ service, onEdit }: ServiceActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteService(service.id);
      if (result.status === "success") {
        toast.success("Đã xóa dịch vụ");
      } else {
        toast.error("Thất bại", { description: result.message });
      }
    });
  };

  return (
    <TableRowActions
      onEdit={onEdit}
      onDelete={handleDelete}
    />
  );
}
