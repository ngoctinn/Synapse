"use client";

import { useTableParams } from "@/shared/hooks";
import { Badge } from "@/shared/ui/badge";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { FileText } from "lucide-react";
import { AuditLog } from "../types";

interface AuditTableProps {
  data: AuditLog[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  isLoading?: boolean;
}

export function AuditTable({
  data,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
  isLoading,
}: AuditTableProps) {
  const { page: urlPage, handlePageChange: urlPageChange } = useTableParams();

  const page = pageProp ?? urlPage;
  const handlePageChange = onPageChangeProp ?? urlPageChange;

  const columns: Column<AuditLog>[] = [
    {
      header: "Thời gian",
      accessorKey: "created_at",
      cell: (row) => (
        <div className="flex flex-col text-sm">
          <span className="font-medium">{format(new Date(row.created_at), "HH:mm", { locale: vi })}</span>
          <span className="text-xs text-muted-foreground">{format(new Date(row.created_at), "dd/MM/yyyy", { locale: vi })}</span>
        </div>
      ),
    },
    {
      header: "Người thực hiện",
      accessorKey: "actor_name",
      cell: (row) => (
        <div className="flex flex-col text-sm">
           <span className="font-medium">{row.actor_name}</span>
           {/* <span className="text-xs text-muted-foreground">{row.actor_id}</span> */}
        </div>
      )
    },
    {
      header: "Hành động",
      accessorKey: "action",
      cell: (row) => {
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
          CREATE: "success",
          UPDATE: "warning",
          DELETE: "destructive",
          LOGIN: "secondary",
          LOGOUT: "secondary",
          COMPLETE: "success",
        };
        return (
          <Badge variant={variants[row.action] || "outline"}>
            {row.action}
          </Badge>
        );
      },
    },
    {
      header: "Đối tượng",
      accessorKey: "entity_type",
      cell: (row) => <div className="text-sm font-medium">{row.entity_type}</div>,
    },
    {
      header: "Chi tiết",
      accessorKey: "details",
      cell: (row) => (
        <div className="max-w-[300px] truncate text-xs text-muted-foreground" title={JSON.stringify(row.details, null, 2)}>
          {row.entity_name && <div className="font-medium text-foreground">{row.entity_name}</div>}
          {JSON.stringify(row.details)}
        </div>
      ),
    },
  ];

  return (
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
        emptyState={
          <DataTableEmptyState
            icon={FileText}
            title="Nhật ký trống"
            description="Chưa có hành động nào được ghi lại."
          />
        }
    />
  );
}
