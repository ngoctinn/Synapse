"use client";

import { Button } from "@/shared/ui/button";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { formatTableDate } from "@/shared/lib/table-utils";
import { formatCurrency, getPaymentStatusColor } from "@/shared/lib/currency-utils";
import { cn } from "@/shared/lib/utils";
import { Eye } from "lucide-react";
import { Invoice } from "../model/types";
import { InvoiceStatusBadge } from "./invoice-status-badge";

interface InvoiceTableProps {
  data: Invoice[];
  onView: (invoice: Invoice) => void;
  isLoading?: boolean;
  // Fix Issue #31: Add selection support
  selection?: {
    selectedIds: Set<string | number>;
    onToggle: (id: string | number) => void;
    onToggleAll: () => void;
    isAllSelected: boolean;
    isPartiallySelected: boolean;
  };
}

export function InvoiceTable({ data, onView, isLoading, selection }: InvoiceTableProps) {
  const columns: Column<Invoice>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: "Mã hóa đơn",
      cell: (item) => <span className="font-medium">{item.id}</span>,
    },
    {
      id: "customerName",
      accessorKey: "customerName",
      header: "Khách hàng",
      cell: (item) => (
        <div className="flex flex-col">
          <span>{item.customerName}</span>
          <span className="text-muted-foreground text-xs">
            {item.customerPhone}
          </span>
        </div>
      ),
    },
    {
      id: "finalAmount",
      accessorKey: "finalAmount",
      header: "Tổng tiền",
      cell: (item) => (
        <span className="font-medium">{formatCurrency(item.finalAmount)}</span>
      ),
    },
    {
      id: "paidAmount",
      accessorKey: "paidAmount",
      header: "Đã thanh toán",
      cell: (item) => (
        <span
          className={cn(
            "font-medium",
            item.paidAmount < item.finalAmount
              ? "text-amber-600 dark:text-amber-500" // Increased contrast for A11y
              : "text-emerald-600 dark:text-emerald-500"
          )}
        >
          {formatCurrency(item.paidAmount)}
        </span>
      ),
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Trạng thái",
      cell: (item) => <InvoiceStatusBadge status={item.status} />,
    },
    {
      id: "issuedAt",
      accessorKey: "issuedAt",
      header: "Ngày tạo",
      cell: (item) => formatTableDate(item.issuedAt, "long"),
    },
    {
      id: "actions",
      header: "Hành động",
      className: "pr-6 text-right",
      cell: (item) => (
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => onView(item)}
          aria-label={`Xem chi tiết hóa đơn ${item.id}`} // Fix Issue 21
        >
          <Eye className="size-4" />
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id}
      isLoading={isLoading}
    />
  );
}
