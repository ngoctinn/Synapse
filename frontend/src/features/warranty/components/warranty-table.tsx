"use client";

import { useTableParams } from "@/shared/hooks";
import { showToast } from "@/shared/ui";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Group, Stack } from "@/shared/ui/layout";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
    AlertTriangle,
    MoreHorizontal,
    ShieldCheck,
    XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateWarrantyStatus } from "../actions";
import { WarrantyTicket } from "../model/types";

interface WarrantyTableProps {
  data: WarrantyTicket[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  isLoading?: boolean;
}

export function WarrantyTable({
  data,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
  isLoading,
}: WarrantyTableProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [rowSelection, setRowSelection] = useState({});

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

  const handleStatusUpdate = (id: string, status: WarrantyTicket["status"]) => {
    startTransition(async () => {
      const result = await updateWarrantyStatus(id, status);
      if (result.status === "success") {
        showToast.success("Thành công", `Đã cập nhật trạng thái: ${status}`);
        router.refresh();
      } else {
        showToast.error("Thất bại", result.message);
      }
    });
  };

  const columns: Column<WarrantyTicket>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="pl-4">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
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
      header: "Mã bảo hành",
      accessorKey: "code",
      enableSorting: true,
      cell: ({ row }) => <span>{row.original.code}</span>,
    },
    {
      header: "Khách hàng",
      accessorKey: "customer_name",
      enableSorting: true,
      cell: ({ row }) => <span>{row.original.customer_name}</span>,
    },
    {
      header: "Dịch vụ/Liệu trình",
      accessorKey: "service_name",
      cell: ({ row }) => (
        <div className="max-w-48 truncate">{row.original.service_name}</div>
      ),
    },
    {
      header: "Thời hạn",
      accessorKey: "end_date",
      enableSorting: true,
      cell: ({ row }) => {
        const end = new Date(row.original.end_date);
        const now = new Date();
        const daysLeft = Math.ceil(
          (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        const isExpired = daysLeft < 0;

        return (
          <Stack gap={0}>
            <span>{format(end, "dd/MM/yyyy", { locale: vi })}</span>
            <span
              className={`text-xs ${isExpired ? "text-destructive" : "text-success"}`}
            >
              {isExpired ? "Đã hết hạn" : `Còn ${daysLeft} ngày`}
            </span>
          </Stack>
        );
      },
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      enableSorting: true,
      cell: ({ row }) => {
        const variants: Record<
          string,
          | "default"
          | "secondary"
          | "destructive"
          | "outline"
          | "success"
          | "warning"
        > = {
          active: "success",
          expired: "secondary",
          voided: "destructive",
          claimed: "warning",
        };
        const labels: Record<string, string> = {
          active: "Hiệu lực",
          expired: "Hết hạn",
          voided: "Đã hủy",
          claimed: "Đang xử lý",
        };
        return (
          <Badge variant={variants[row.original.status] || "outline"}>
            {labels[row.original.status] || row.original.status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Group justify="end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label="Mở menu">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(row.original.id, "claimed")}
              >
                <AlertTriangle className="mr-2 h-4 w-4" /> Yêu cầu bảo hành
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(row.original.id, "voided")}
                className="text-destructive"
              >
                <XCircle className="mr-2 h-4 w-4" /> Hủy hiệu lực
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Group>
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
        variant="flush"
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection as any}
        getRowId={(row) => row.id}
        emptyState={
          <DataTableEmptyState
            icon={ShieldCheck}
            title="Chưa có phiếu bảo hành"
            description="Tạo phiếu bảo hành mới cho khách hàng."
            // action={<CreateWarrantyTrigger />}
          />
        }
      />
      {/* View/Edit sheet can be added later */}
    </>
  );
}
