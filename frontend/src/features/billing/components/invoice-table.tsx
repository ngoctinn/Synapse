"use client";

import { DataTable } from "@/shared/ui/custom/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Eye } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Invoice } from "../types";
import { InvoiceStatusBadge } from "./invoice-status-badge";

interface InvoiceTableProps {
  data: Invoice[];
  onView: (invoice: Invoice) => void;
  isLoading?: boolean;
}

export function InvoiceTable({ data, onView, isLoading }: InvoiceTableProps) {
  const columns: ColumnDef<Invoice>[] = [
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
          <span className="text-xs text-muted-foreground">
            {row.original.customerPhone}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "finalAmount",
      header: "Tổng tiền",
      cell: ({ row }) => (
        <span className="font-medium">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(row.original.finalAmount)}
        </span>
      ),
    },
    {
      accessorKey: "paidAmount",
      header: "Đã thanh toán",
      cell: ({ row }) => (
        <span className={row.original.paidAmount < row.original.finalAmount ? "text-orange-600" : "text-green-600"}>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(row.original.paidAmount)}
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
      cell: ({ row }) => format(row.original.issuedAt, "dd/MM/yyyy HH:mm", { locale: vi }),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView(row.original)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      searchColumn="customerName"
      searchPlaceholder="Tìm kiếm hóa đơn..."
    />
  );
}
