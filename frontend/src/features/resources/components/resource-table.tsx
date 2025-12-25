"use client";

import { useTableSelection } from "@/shared/hooks/use-table-selection";
import { cn } from "@/shared/lib/utils";
import { Z_INDEX } from "@/shared/lib/design-tokens";
import { Badge } from "@/shared/ui/badge";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
import { DeleteConfirmDialog } from "@/shared/ui/custom/delete-confirm-dialog";
import { TableActionBar } from "@/shared/ui/custom/table-action-bar";
import { showToast } from "@/shared/ui/sonner";
import { Bed, Box, Loader2 } from "lucide-react";
import { Icon } from "@/shared/ui/custom/icon";
import { useState, useTransition } from "react";
import { deleteResource } from "../actions";
import { Resource, ResourceGroup } from "../model/types";
import { CreateResourceTrigger } from "./create-resource-trigger";
import { ResourceActions } from "./resource-actions";
import { ResourceSheet } from "./resource-sheet";

interface ResourceTableProps {
  data: Resource[];
  groups: ResourceGroup[];
  isLoading?: boolean;
  className?: string;
  variant?: "default" | "flush";
}

export function ResourceTable({
  data,
  groups,
  isLoading,
  className,
  variant = "default",
}: ResourceTableProps) {
  const [editResource, setEditResource] = useState<Resource | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  const selection = useTableSelection({
    data,
    keyExtractor: (item) => item.id,
  });

  const handleBulkDelete = async () => {
    const ids = Array.from(selection.selectedIds) as string[];
    if (ids.length === 0) return;

    startTransition(async () => {
      try {
        let successCount = 0;
        for (const id of ids) {
          try {
            const result = await deleteResource(id);
            if (result.status === "success") successCount++;
          } catch (e) {
            console.error(`Failed to delete ${id}:`, e);
          }
        }

        if (successCount > 0) {
          showToast.success("Thành công", `Đã xóa ${successCount} tài nguyên`);
          selection.clearAll();
        }
        if (successCount < ids.length) {
          showToast.error(
            "Lỗi",
            `Không thể xóa ${ids.length - successCount} tài nguyên`
          );
        }
      } catch (error) {
        console.error(error);
        showToast.error("Lỗi", "Không thể xóa tài nguyên");
      } finally {
        setShowBulkDeleteDialog(false);
      }
    });
  };

  const columns: Column<Resource>[] = [
    {
      header: "Tên & Mã",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-foreground font-medium">{row.name}</span>
          <span className="text-muted-foreground text-xs">{row.code}</span>
        </div>
      ),
    },
    {
      header: "Loại",
      cell: (row) => (
        <Badge
          preset={row.type === "BED" ? "resource-bed" : "resource-equipment"}
        >
          {row.type === "BED" ? (
            <Icon icon={Bed} />
          ) : (
            <Icon icon={Box} />
          )}
        </Badge>
      ),
    },
    {
      header: "Trạng thái",
      cell: (row) => {
        const presetMap: Record<string, any> = {
          ACTIVE: "resource-available",
          MAINTENANCE: "resource-maintenance",
          INACTIVE: "appointment-cancelled", // Hết hoạt động dùng cancelled
        };
        const preset = presetMap[row.status] || "status-inactive";

        return <Badge preset={preset} size="sm" />;
      },
    },
    {
      header: "Chi tiết",
      cell: (row) => {
        if (row.type === "BED") {
          return (
            <div className="text-sm">
              <span className="text-muted-foreground">
                Sức chứa:{" "}
                <span className="text-foreground">{row.capacity}</span> người
              </span>
              {row.setupTime !== undefined && row.setupTime > 0 && (
                <span className="text-muted-foreground ml-3 border-l pl-3">
                  Setup:{" "}
                  <span className="text-foreground">{row.setupTime}p</span>
                </span>
              )}
            </div>
          );
        }

        if (row.type === "EQUIPMENT") {
          return (
            <div className="flex items-center gap-3 text-sm">
              {row.tags && row.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {row.tags.slice(0, 2).map((tag, i) => (
                    <Badge key={i} preset="tag">
                      {tag}
                    </Badge>
                  ))}
                  {row.tags.length > 2 && (
                    <span className="text-muted-foreground text-[10px]">
                      +{row.tags.length - 2}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
            </div>
          );
        }
        return null;
      },
    },
    {
      header: "Hành động",
      className: "pr-6 text-right",
      cell: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ResourceActions resource={row} onEdit={() => setEditResource(row)} />
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        className={cn(className)}
        variant={variant}
        selection={{
          isSelected: selection.isSelected,
          onToggleOne: selection.toggleOne,
          onToggleAll: selection.toggleAll,
          isAllSelected: selection.isAllSelected,
          isPartiallySelected: selection.isPartiallySelected,
        }}
        onRowClick={(resource) => setEditResource(resource)}
        emptyState={
          <DataTableEmptyState
            icon={Box}
            title="Chưa có tài nguyên nào"
            description="Tạo tài nguyên đầu tiên để bắt đầu quản lý."
            action={<CreateResourceTrigger groups={groups} />}
          />
        }
        disabled={isPending}
      />

      {/* Loading Overlay */}
      {isPending && (
        <div className={cn(Z_INDEX.loadingOverlay, "bg-background/50 text-muted-foreground absolute inset-0 flex items-center justify-center gap-2 text-sm backdrop-blur-[1px]")}>
          <Icon icon={Loader2} className="animate-spin" />
          <span>Đang xử lý...</span>
        </div>
      )}

      <TableActionBar
        selectedCount={selection.selectedCount}
        onDelete={() => setShowBulkDeleteDialog(true)}
        onDeselectAll={selection.clearAll}
        isLoading={isPending}
      />

      <ResourceSheet
        mode="update"
        resource={editResource ?? undefined}
        open={!!editResource}
        onOpenChange={(open) => !open && setEditResource(null)}
        groups={groups}
      />

      <DeleteConfirmDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        isDeleting={isPending}
        entityName={`${selection.selectedCount} tài nguyên`}
      />
    </>
  );
}
export function ResourceTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={5}
      rowCount={5}
      searchable={false}
      filterable={false}
      showAction={false}
      variant="flush"
    />
  );
}
