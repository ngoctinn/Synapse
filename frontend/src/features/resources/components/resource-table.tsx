"use client";

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
import { Button } from "@/shared/ui/button";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
import { Bed, Box, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
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
  const router = useRouter();

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
            </div>
          );
        }

        if (row.type === "EQUIPMENT") {
          return (
            <div className="text-sm">
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
            </div>
          );
        }
        return null;
      },
    },
    {
      header: "Hành động",
      cell: (row) => {
        return (
          <div className="flex items-center gap-2">
            <ResourceDialog
              resource={row}
              trigger={
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <span className="sr-only">Sửa</span>
                  <Pencil className="h-4 w-4" />
                </Button>
              }
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => setDeleteId(row.id)}
            >
              <span className="sr-only">Xóa</span>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
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
        emptyState={
          <DataTableEmptyState
            icon={Box}
            title="Chưa có tài nguyên nào"
            description="Tạo tài nguyên đầu tiên để bắt đầu quản lý."
            action={<ResourceDialog />}
          />
        }
      />

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
      className="border-none shadow-none rounded-none"
    />
  )
}
