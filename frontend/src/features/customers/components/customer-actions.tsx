"use client";

import { deleteCustomer } from "@/features/customers/actions";
import { Customer } from "@/features/customers/model/types";
import { useDeleteAction } from "@/shared/hooks";
import { DeleteConfirmDialog } from "@/shared/ui";
import { TableRowActions } from "@/shared/ui/custom/table-row-actions";

interface CustomerActionsProps {
  customer: Customer;
  onEdit: () => void;
}

export function CustomerActions({ customer, onEdit }: CustomerActionsProps) {
  const { handleDelete, dialogProps, openDeleteDialog, isPending } =
    useDeleteAction({
      deleteAction: deleteCustomer,
      entityName: "khách hàng",
      refreshOnSuccess: true,
    });

  return (
    <>
      <TableRowActions
        onEdit={onEdit}
        onDelete={openDeleteDialog}
        disabled={isPending}
      />

      <DeleteConfirmDialog
        {...dialogProps}
        onConfirm={() => handleDelete(customer.id)}
        entityName="khách hàng"
        entityLabel={customer.full_name}
      />
    </>
  );
}
