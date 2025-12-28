"use client";

import { useDeleteAction } from "@/shared/hooks";
import {
    DeleteConfirmDialog,
    TableRowActions,
} from "@/shared/ui";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/shared/ui/sheet";
import { useState } from "react";
import { deleteServiceCategory } from "../actions";
import { ServiceCategory } from "../model/types";
import { CategoryForm } from "./category-form";

interface CategoryActionsProps {
  category: ServiceCategory;
}

export function CategoryActions({ category }: CategoryActionsProps) {
  const [showEditSheet, setShowEditSheet] = useState(false);

  const { handleDelete, dialogProps, openDeleteDialog, isPending } =
    useDeleteAction({
      deleteAction: deleteServiceCategory,
      entityName: "danh mục",
    });

  return (
    <>
      <TableRowActions
        onEdit={() => setShowEditSheet(true)}
        onDelete={openDeleteDialog}
        disabled={isPending}
      />

      <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Cập nhật Danh mục</SheetTitle>
            <SheetDescription>
              Chỉnh sửa thông tin danh mục dịch vụ.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <CategoryForm
              category={category}
              mode="edit"
              onSuccess={() => setShowEditSheet(false)}
              onCancel={() => setShowEditSheet(false)}
            />
          </div>
        </SheetContent>
      </Sheet>

      <DeleteConfirmDialog
        {...dialogProps}
        onConfirm={() => handleDelete(category.id)}
        entityName="danh mục"
        entityLabel={category.name}
      />
    </>
  );
}
