"use client";

import { useTableSelection } from "@/shared/hooks/use-table-selection";
import { cn } from "@/shared/lib/utils";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Badge } from "@/shared/ui/badge";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
import { TableActionBar } from "@/shared/ui/custom/table-action-bar";
import { TableRowActions } from "@/shared/ui/custom/table-row-actions";
import { Bed, Box } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteResource } from "../actions";
import { Resource } from "../model/types";
import { ResourceDialog } from "./resource-dialog";

interface ResourceTableProps {
  data: Resource[];
  isLoading?: boolean;
  className?: string;
  variant?: "default" | "flush";
}

export function ResourceTable({ data, isLoading, className, variant = "default" }: ResourceTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editResource, setEditResource] = useState<Resource | null>(null);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Selection state
  const selection = useTableSelection({
    data,
    keyExtractor: (item) => item.id,
  });

  // Xóa một tài nguyên
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteResource(deleteId);
      toast.success("Đã xóa tài nguyên");
      setDeleteId(null);
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa tài nguyên");
    }
  };

  // Xóa nhiều tài nguyên
  const handleBulkDelete = async () => {
    const ids = Array.from(selection.selectedIds) as string[];
    if (ids.length === 0) return;

    startTransition(async () => {
      try {
        // Xóa từng item một (có thể tối ưu thành batch API sau)
        let successCount = 0;
        for (const id of ids) {
          try {
            await deleteResource(id);
            successCount++;
          } catch (e) {
            console.error(`Failed to delete ${id}:`, e);
          }
        }

        if (successCount > 0) {
          toast.success(`Đã xóa ${successCount} tài nguyên`);
          selection.clearAll();
        }
        if (successCount < ids.length) {
          toast.error(`Không thể xóa ${ids.length - successCount} tài nguyên`);
        }
      } catch (error) {
        console.error(error);
        toast.error("Không thể xóa tài nguyên");
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
          <span className="font-medium">{row.name}</span>
          <span className="text-xs text-muted-foreground">{row.code}</span>
        </div>
      ),
    },
    {
      header: "Loại",
      cell: (row) => (
        <Badge variant="outline" className="gap-1">
          {row.type === "ROOM" ? (
            <Bed className="h-3 w-3" />
          ) : (
            <Box className="h-3 w-3" />
          )}
          {row.type === "ROOM" ? "Phòng" : "Thiết bị"}
        </Badge>
      ),
    },
    {
      header: "Trạng thái",
      cell: (row) => (
        <Badge
          variant={
            row.status === "ACTIVE"
              ? "default"
              : "secondary"
          }
          className={
            row.status === "MAINTENANCE"
              ? "bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/20 border-yellow-200"
              : ""
          }
        >
          {row.status === "ACTIVE"
            ? "Hoạt động"
            : row.status === "MAINTENANCE"
            ? "Bảo trì"
            : "Ngưng hoạt động"}
        </Badge>
      ),
    },
    {
      header: "Chi tiết",
      cell: (row) => {
        if (row.type === "ROOM") {
          return (
            <div className="text-sm">
              <span className="text-muted-foreground">
                Sức chứa:{" "}
                <span className="text-foreground">{row.capacity}</span> người
              </span>
              {row.setupTime !== undefined && row.setupTime > 0 && (
                <span className="text-muted-foreground ml-3 border-l pl-3">
                  Setup: <span className="text-foreground">{row.setupTime}p</span>
                </span>
              )}
            </div>
          );
        }

        if (row.type === "EQUIPMENT") {
          return (
            <div className="text-sm flex items-center gap-3">
              {row.tags && row.tags.length > 0 ? (
                <div className="flex gap-1 flex-wrap">
                  {row.tags.slice(0, 2).map((tag, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="text-[10px] px-1 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {row.tags.length > 2 && (
                    <span className="text-[10px] text-muted-foreground">
                      +{row.tags.length - 2}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">-</span>
              )}
              {row.setupTime !== undefined && row.setupTime > 0 && (
                <span className="text-muted-foreground ml-3 border-l pl-3">
                  Setup: <span className="text-foreground">{row.setupTime}p</span>
                </span>
              )}
            </div>
          );
        }
        return null;
      },
    },
    {
      header: "Hành động",
      cell: (row) => (
        <TableRowActions
          onEdit={() => setEditResource(row)}
          onDelete={() => setDeleteId(row.id)}
        />
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
        // Selection props
        selectable
        isSelected={selection.isSelected}
        onToggleOne={selection.toggleOne}
        onToggleAll={selection.toggleAll}
        isAllSelected={selection.isAllSelected}
        isPartiallySelected={selection.isPartiallySelected}
        emptyState={
          <DataTableEmptyState
            icon={Box}
            title="Chưa có tài nguyên nào"
            description="Tạo tài nguyên đầu tiên để bắt đầu quản lý."
            action={<ResourceDialog />}
          />
        }
      />

      {/* Floating Action Bar cho bulk actions */}
      <TableActionBar
        selectedCount={selection.selectedCount}
        onDelete={() => setShowBulkDeleteDialog(true)}
        onDeselectAll={selection.clearAll}
        isLoading={isPending}
      />

      {/* Edit Dialog - controlled state */}
      <ResourceDialog
        resource={editResource ?? undefined}
        open={!!editResource}
        onOpenChange={(open) => !open && setEditResource(null)}
      />

      {/* Delete Single Confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tài nguyên sẽ bị xóa vĩnh viễn
              khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Confirmation */}
      <AlertDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xóa {selection.selectedCount} tài nguyên?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tất cả tài nguyên đã chọn sẽ bị
              xóa vĩnh viễn khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? "Đang xóa..." : `Xóa ${selection.selectedCount} mục`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function ResourceTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={6}
      rowCount={5}
      searchable={false}
      filterable={false}
      showAction={false}
      className="border-none shadow-none rounded-none"
    />
  )
}
