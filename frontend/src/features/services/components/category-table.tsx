"use client";

import { useBulkAction, useTableParams } from "@/shared/hooks";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
import { DeleteConfirmDialog } from "@/shared/ui/custom/delete-confirm-dialog";
import { TableActionBar } from "@/shared/ui/custom/table-action-bar";
import { Plus } from "lucide-react";
import { useState } from "react";
import { deleteServiceCategory } from "../actions";
import { ServiceCategory } from "../model/types";

interface CategoryTableProps {
  categories: ServiceCategory[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  variant?: "default" | "flush";
  isLoading?: boolean;
}

export function CategoryTable({
  categories,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
  variant = "default",
  isLoading,
}: CategoryTableProps) {
  const { page: urlPage, handlePageChange: urlPageChange } = useTableParams();
  const page = pageProp ?? urlPage;
  const handlePageChange = onPageChangeProp ?? urlPageChange;

  const [rowSelection, setRowSelection] = useState({});

  const {
    execute: executeBulkDelete,
    isPending,
    showDialog: showBulkDeleteDialog,
    setShowDialog: setShowBulkDeleteDialog,
  } = useBulkAction(deleteServiceCategory, {
    successMessage: (count) => `Đã xóa ${count} danh mục`,
    errorMessage: (count) => `Không thể xóa ${count} danh mục`,
  });

  const handleBulkDelete = () => {
    const ids = Object.keys(rowSelection);
    executeBulkDelete(ids, () => setRowSelection({}));
  };

  const columns: Column<ServiceCategory>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="pl-4">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="pl-4">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
    },
    {
      header: "Thứ tự",
      accessorKey: "sort_order",
      cell: ({ row }) => <span className="text-muted-foreground font-mono">{row.original.sort_order}</span>,
    },
    {
      header: "Tên danh mục",
      accessorKey: "name",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      header: "Hành động",
      id: "actions",
      cell: ({ row }) => (
        <Badge variant="outline" className="cursor-pointer hover:bg-muted">Chỉnh sửa</Badge>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={categories}
        columns={columns}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className={className}
        variant={variant}
        isLoading={isLoading}
        skeletonCount={5}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection as any}
        getRowId={(row) => row.id.toString()}
        emptyState={
          <DataTableEmptyState
            icon={Plus}
            title="Chưa có danh mục nào"
            description="Tạo danh mục để phân loại các dịch vụ tại spa."
            action={<Badge>Thêm danh mục mới</Badge>}
          />
        }
      />

      <TableActionBar
        selectedCount={Object.keys(rowSelection).length}
        onDelete={() => setShowBulkDeleteDialog(true)}
        onDeselectAll={() => setRowSelection({})}
        isLoading={isPending}
      />

      <DeleteConfirmDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        isDeleting={isPending}
        entityName={`${Object.keys(rowSelection).length} danh mục`}
      />
    </>
  );
}

export function CategoryTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={4}
      rowCount={5}
      searchable={false}
      filterable={false}
      showAction={false}
      variant="flush"
    />
  );
}
