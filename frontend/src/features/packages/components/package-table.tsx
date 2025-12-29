"use client";

import { Service } from "@/features/services";
import { AnimatedGiftIcon } from "@/shared/components/animated-icon";
import { Column, DataTable } from "@/shared/components/data-table";
import { DataTableEmptyState } from "@/shared/components/data-table-empty-state";
import { DeleteConfirmDialog } from "@/shared/components/delete-confirm-dialog";
import { TableActionBar } from "@/shared/components/table-action-bar";
import { useTableParams } from "@/shared/hooks";
import { Z_INDEX } from "@/shared/lib/design-tokens";
import { cn, formatCurrency } from "@/shared/lib/utils";
import { showToast } from "@/shared/components/sonner";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";
import { RowSelectionState } from "@tanstack/react-table";
import { Loader2, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deletePackage } from "../actions";
import { ServicePackage } from "../model/types";
import { CreatePackageTrigger } from "./create-package-trigger";
import { PackageSheet } from "./package-sheet";

interface PackageTableProps {
  data: ServicePackage[];
  page?: number;
  totalPages?: number;
  availableServices: Service[];
  onPageChange?: (page: number) => void;
  className?: string;
  isLoading?: boolean;
}

export function PackageTable({
  data,
  page: pageProp,
  totalPages = 1,
  availableServices,
  onPageChange: onPageChangeProp,
  className,
  isLoading,
}: PackageTableProps) {
  const router = useRouter();
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(
    null
  );
  const [isPending, startTransition] = useTransition();

  const { page: urlPage, handlePageChange: urlPageChange } = useTableParams({
    defaultSortBy: "created_at",
    defaultOrder: "desc",
  });

  const page = pageProp ?? urlPage;

  const handlePageChange = onPageChangeProp ?? urlPageChange;

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handleBulkDelete = async () => {
    startTransition(async () => {
      const selectedIds = Object.keys(rowSelection);
      let successCount = 0;

      const results = await Promise.allSettled(
        selectedIds.map((id) => deletePackage(id.toString()))
      );

      results.forEach((result) => {
        if (
          result.status === "fulfilled" &&
          result.value.status === "success"
        ) {
          successCount++;
        }
      });

      if (successCount > 0) {
        showToast.success("Thành công", `Đã xóa ${successCount} gói dịch vụ`);
        setRowSelection({});
        router.refresh();
      }

      setShowBulkDeleteDialog(false);
    });
  };

  const columns: Column<ServicePackage>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="pl-4">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
      enableHiding: false,
    },
    {
      header: "Gói dịch vụ",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
            <Package className="text-primary size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-foreground text-sm font-semibold">
              {row.original.name}
            </span>
            <span className="text-muted-foreground line-clamp-1 text-xs">
              {row.original.description || "Không có mô tả"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Dịch vụ",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.services.slice(0, 2).map((s) => (
            <Badge key={s.service_id} variant="secondary" size="sm">
              {s.service_name} x{s.quantity}
            </Badge>
          ))}
          {row.original.services.length > 2 && (
            <Badge variant="outline" size="sm">
              +{row.original.services.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: "Giá",
      accessorKey: "price",
      cell: ({ row }) => (
        <div className="text-sm font-semibold">
          {formatCurrency(row.original.price)}
        </div>
      ),
    },
    {
      header: "Hiệu lực",
      accessorKey: "validity_days",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.validity_days} ngày</div>
      ),
    },
    {
      header: "Trạng thái",
      accessorKey: "is_active",
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? "success" : "secondary"}>
          {row.original.is_active ? "Đang bán" : "Tạm ngưng"}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className={className}
        isLoading={isLoading}
        skeletonCount={5}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
        getRowId={(row) => row.id.toString()}
        onRowClick={(pkg) => setEditingPackage(pkg)}
        emptyState={
          <DataTableEmptyState
            icon={AnimatedGiftIcon}
            title="Chưa có gói dịch vụ"
            description="Tạo gói combo để bán cho khách hàng."
            action={
              <CreatePackageTrigger availableServices={availableServices} />
            }
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
        entityName={`${Object.keys(rowSelection).length} gói dịch vụ`}
      />

      {editingPackage && (
        <PackageSheet
          mode="update"
          initialData={editingPackage}
          open={!!editingPackage}
          onOpenChange={(open) => !open && setEditingPackage(null)}
          availableServices={availableServices}
        />
      )}

      {isPending && (
        <div
          className={cn(
            Z_INDEX.loadingOverlay,
            "bg-background/50 absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px]"
          )}
        >
          <Loader2 className="text-primary mb-2 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground animate-pulse text-sm font-medium">
            Đang xử lý...
          </p>
        </div>
      )}
    </>
  );
}

export { PackageTableSkeleton } from "./package-table-skeleton";
