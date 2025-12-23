"use client";

import { useTableParams, useTableSelection } from "@/shared/hooks";
import { DeleteConfirmDialog, showToast } from "@/shared/ui";
import { Badge } from "@/shared/ui/badge";
import { AnimatedGiftIcon } from "@/shared/ui/custom/animated-icon";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { TableActionBar } from "@/shared/ui/custom/table-action-bar";
import { formatCurrency } from "@/shared/lib/utils";
import { Loader2, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deletePackage } from "../actions";
import { ServicePackage } from "../model/types";
import { PackageSheet } from "./package-sheet";
import { CreatePackageTrigger } from "./create-package-trigger";

interface PackageTableProps {
  data: ServicePackage[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  isLoading?: boolean;
}

export function PackageTable({
  data,
  page: pageProp,
  totalPages = 1,
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

  const {
    page: urlPage,
    sortBy,
    order,
    handlePageChange: urlPageChange,
    handleSort,
  } = useTableParams({
    defaultSortBy: "created_at",
    defaultOrder: "desc",
  });

  const page = pageProp ?? urlPage;
  const handlePageChange = onPageChangeProp ?? urlPageChange;

  const selection = useTableSelection({
    data,
    keyExtractor: (item) => item.id,
  });

  const handleBulkDelete = async () => {
    startTransition(async () => {
      const selectedIds = Array.from(selection.selectedIds);
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
        selection.clearAll();
        router.refresh();
      }

      setShowBulkDeleteDialog(false);
    });
  };

  const columns: Column<ServicePackage>[] = [
    {
      header: "Gói dịch vụ",
      accessorKey: "name",
      sortable: true,
      cell: (pkg) => (
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
            <Package className="text-primary size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-foreground text-sm font-semibold">
              {pkg.name}
            </span>
            <span className="text-muted-foreground line-clamp-1 text-xs">
              {pkg.description || "Không có mô tả"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Dịch vụ",
      cell: (pkg) => (
        <div className="flex flex-wrap gap-1">
          {pkg.services.slice(0, 2).map((s) => (
            <Badge key={s.service_id} variant="secondary" size="sm">
              {s.service_name} x{s.quantity}
            </Badge>
          ))}
          {pkg.services.length > 2 && (
            <Badge variant="outline" size="sm">
              +{pkg.services.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: "Giá",
      accessorKey: "price",
      sortable: true,
      cell: (pkg) => (
        <div className="text-sm font-semibold">{formatCurrency(pkg.price)}</div>
      ),
    },
    {
      header: "Hiệu lực",
      accessorKey: "validity_days",
      cell: (pkg) => <div className="text-sm">{pkg.validity_days} ngày</div>,
    },
    {
      header: "Trạng thái",
      accessorKey: "is_active",
      cell: (pkg) => (
        <Badge variant={pkg.is_active ? "success" : "secondary"}>
          {pkg.is_active ? "Đang bán" : "Tạm ngưng"}
        </Badge>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        keyExtractor={(item) => item.id}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className={className}
        isLoading={isLoading}
        skeletonCount={5}
        variant="flush"
        selection={{
          isSelected: selection.isSelected,
          onToggleOne: selection.toggleOne,
          onToggleAll: selection.toggleAll,
          isAllSelected: selection.isAllSelected,
          isPartiallySelected: selection.isPartiallySelected,
        }}
        onRowClick={(pkg) => setEditingPackage(pkg)}
        sort={{
          column: sortBy,
          direction: order,
          onSort: handleSort,
        }}
        emptyState={
          <DataTableEmptyState
            icon={AnimatedGiftIcon}
            title="Chưa có gói dịch vụ"
            description="Tạo gói combo để bán cho khách hàng."
            action={<CreatePackageTrigger />}
          />
        }
      />

      <TableActionBar
        selectedCount={selection.selectedCount}
        onDelete={() => setShowBulkDeleteDialog(true)}
        onDeselectAll={selection.clearAll}
        isLoading={isPending}
      />

      <DeleteConfirmDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        isDeleting={isPending}
        entityName={`${selection.selectedCount} gói dịch vụ`}
      />

      {editingPackage && (
        <PackageSheet
          mode="update"
          initialData={editingPackage}
          open={!!editingPackage}
          onOpenChange={(open) => !open && setEditingPackage(null)}
        />
      )}

      {isPending && (
        <div className="bg-background/50 absolute inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-[2px]">
          <Loader2 className="text-primary mb-2 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground animate-pulse text-sm font-medium">
            Đang xử lý...
          </p>
        </div>
      )}
    </>
  );
}
