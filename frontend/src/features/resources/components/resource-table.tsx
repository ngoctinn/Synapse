"use client";

import { Z_INDEX } from "@/shared/lib/design-tokens";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";
import { Column, DataTable } from "@/shared/components/data-table";
import { DataTableEmptyState } from "@/shared/components/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/components/data-table-skeleton";
import { DeleteConfirmDialog } from "@/shared/components/delete-confirm-dialog";
import { Icon } from "@/shared/components/icon";
import { TableActionBar } from "@/shared/components/table-action-bar";
import { showToast } from "@/shared/ui/sonner";
import { Bed, Box, Loader2 } from "lucide-react";
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
  const [rowSelection, setRowSelection] = useState({});

  const handleBulkDelete = async () => {
    const ids = Object.keys(rowSelection);
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
          setRowSelection({});
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
      enableHiding: false,
    },
    {
      header: "Tên & Mã",
      accessorKey: "name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-foreground font-medium">{row.original.name}</span>
          <span className="text-muted-foreground text-xs">{row.original.code}</span>
        </div>
      ),
    },
    {
      header: "Loại",
      accessorKey: "type",
      cell: ({ row }) => (
        <Badge
          preset={row.original.type === "BED" ? "resource-bed" : "resource-equipment"}
        >
          {row.original.type === "BED" ? (
            <Icon icon={Bed} />
          ) : (
            <Icon icon={Box} />
          )}
        </Badge>
      ),
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      cell: ({ row }) => {
        const presetMap: Record<string, any> = {
          ACTIVE: "resource-available",
          MAINTENANCE: "resource-maintenance",
          INACTIVE: "appointment-cancelled", // Hết hoạt động dùng cancelled
        };
        const preset = presetMap[row.original.status] || "status-inactive";

        return <Badge preset={preset} size="sm" />;
      },
    },
    {
      header: "Chi tiết",
      id: "details",
      cell: ({ row }) => {
        if (row.original.type === "BED") {
          return (
            <div className="text-sm">
              <span className="text-muted-foreground">
                Sức chứa:{" "}
                <span className="text-foreground">{row.original.capacity}</span> người
              </span>
              {row.original.setupTime !== undefined && row.original.setupTime > 0 && (
                <span className="text-muted-foreground ml-3 border-l pl-3">
                  Setup:{" "}
                  <span className="text-foreground">{row.original.setupTime}p</span>
                </span>
              )}
            </div>
          );
        }

        if (row.original.type === "EQUIPMENT") {
          return (
            <div className="flex items-center gap-3 text-sm">
              {row.original.tags && row.original.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {row.original.tags.slice(0, 2).map((tag: string, i: number) => (
                    <Badge key={i} preset="tag">
                      {tag}
                    </Badge>
                  ))}
                  {row.original.tags.length > 2 && (
                    <span className="text-muted-foreground text-[10px]">
                      +{row.original.tags.length - 2}
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
      id: "actions",
      cell: ({ row }) => (
        <div onClick={(e) => e.stopPropagation()} className="flex justify-end pr-6">
          <ResourceActions resource={row.original} onEdit={() => setEditResource(row.original)} />
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        className={cn(className)}
        variant={variant}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection as any}
        getRowId={(row) => row.id.toString()}
        onRowClick={(resource) => setEditResource(resource)}
        emptyState={
          <DataTableEmptyState
            icon={Box}
            title="Chưa có tài nguyên nào"
            description="Tạo tài nguyên đầu tiên để bắt đầu quản lý."
            action={<CreateResourceTrigger groups={groups} />}
          />
        }
      />

      {/* Loading Overlay */}
      {isPending && (
        <div className={cn(Z_INDEX.loadingOverlay, "bg-background/50 text-muted-foreground absolute inset-0 flex items-center justify-center gap-2 text-sm backdrop-blur-[1px]")}>
          <Icon icon={Loader2} className="animate-spin" />
          <span>Đang xử lý...</span>
        </div>
      )}

      <TableActionBar
        selectedCount={Object.keys(rowSelection).length}
        onDelete={() => setShowBulkDeleteDialog(true)}
        onDeselectAll={() => setRowSelection({})}
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
        entityName={`${Object.keys(rowSelection).length} tài nguyên`}
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
