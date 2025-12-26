"use client";

import { useTransition } from "react";
import { useTableParams } from "@/shared/hooks";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { showToast } from "@/shared/ui";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  AlertTriangle,
  MoreHorizontal,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { updateWarrantyStatus } from "../actions";
import { WarrantyTicket } from "../model/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

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
      header: "Mã bảo hành",
      accessorKey: "code",
      cell: (w) => <span className="font-mono font-medium">{w.code}</span>,
    },
    {
      header: "Khách hàng",
      accessorKey: "customer_name",
    },
    {
      header: "Dịch vụ/Liệu trình",
      accessorKey: "service_name",
      cell: (w) => (
        <div className="max-w-48 truncate text-sm">{w.service_name}</div>
      ),
    },
    {
      header: "Thời hạn",
      accessorKey: "end_date",
      sortable: true,
      cell: (w) => {
        const end = new Date(w.end_date);
        const now = new Date();
        const daysLeft = Math.ceil(
          (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        const isExpired = daysLeft < 0;

        return (
          <div className="flex flex-col text-sm">
            <span>{format(end, "dd/MM/yyyy", { locale: vi })}</span>
            <span
              className={`text-xs ${isExpired ? "text-destructive" : "text-success"}`}
            >
              {isExpired ? "Đã hết hạn" : `Còn ${daysLeft} ngày`}
            </span>
          </div>
        );
      },
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      cell: (w) => {
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
          <Badge variant={variants[w.status] || "outline"}>
            {labels[w.status] || w.status}
          </Badge>
        );
      },
    },
    {
      header: "",
      id: "actions",
      cell: (w) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(w.id, "claimed")}
              >
                <AlertTriangle className="h-4 w-4" /> Yêu cầu bảo hành
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(w.id, "voided")}
                className="text-destructive"
              >
                <XCircle className="h-4 w-4" /> Hủy hiệu lực
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className={className}
        isLoading={isLoading}
        skeletonCount={5}
        variant="flush"
        sort={{
          column: sortBy,
          direction: order,
          onSort: handleSort,
        }}
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
