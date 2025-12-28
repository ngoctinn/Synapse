"use client";

import { formatCurrency } from "@/shared/lib/currency-utils";
import { formatTableDate } from "@/shared/lib/table-utils";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { Eye } from "lucide-react";
import { Invoice } from "../model/types";
import { InvoiceStatusBadge } from "./invoice-status-badge";

interface InvoiceTableProps {
  data: Invoice[];
  onView: (invoice: Invoice) => void;
  isLoading?: boolean;
}

export function InvoiceTable({ data, onView, isLoading }: InvoiceTableProps) {
  const columns: Column<Invoice>[] = [
    {
      accessorKey: "id",
      header: "Mã hóa đơn",
      cell: ({ row }) => <span className="font-medium">{row.original.id}</span>,
    },
    {
      accessorKey: "customerName",
      header: "Khách hàng",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span>{row.original.customerName}</span>
          <span className="text-muted-foreground text-xs">
            {row.original.customerPhone}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "finalAmount",
      header: "Tổng tiền",
      cell: ({ row }) => (
        <span className="font-medium">{formatCurrency(row.original.finalAmount)}</span>
      ),
    },
    {
      accessorKey: "paidAmount",
      header: "Đã thanh toán",
      cell: ({ row }) => (
        <span
          className={cn(
            "font-medium",
            row.original.paidAmount < row.original.finalAmount
              ? "text-amber-600 dark:text-amber-500" // Increased contrast for A11y
              : "text-emerald-600 dark:text-emerald-500"
          )}
        >
          {formatCurrency(row.original.paidAmount)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Trạng thái",
      cell: ({ row }) => <InvoiceStatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "issuedAt",
      header: "Ngày tạo",
      cell: ({ row }) => formatTableDate(row.original.issuedAt, "long"),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Hành động</div>,
      cell: ({ row }) => (
        <div className="text-right pr-6">
            <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={() => onView(row.original)}
            aria-label={`Xem chi tiết hóa đơn ${row.original.id}`}
            >
            <Eye className="size-4" />
            </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
    />
  );
}
