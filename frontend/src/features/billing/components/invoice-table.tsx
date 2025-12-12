"use client";

import { Button } from "@/shared/ui/button";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Eye } from "lucide-react";
import { Invoice } from "../types";
import { InvoiceStatusBadge } from "./invoice-status-badge";

interface InvoiceTableProps {
  data: Invoice[];
  onView: (invoice: Invoice) => void;
  isLoading?: boolean;
}

export function InvoiceTable({ data, onView, isLoading }: InvoiceTableProps) {
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
          <span className="text-xs text-muted-foreground">
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
        <span className="font-medium">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(item.finalAmount)}
        </span>
      ),
    },
    {
      id: "paidAmount",
      accessorKey: "paidAmount",
      header: "Đã thanh toán",
      cell: (item) => (
        <span className={item.paidAmount < item.finalAmount ? "text-warning" : "text-success"}>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(item.paidAmount)}
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
      cell: (item) => format(item.issuedAt, "dd/MM/yyyy HH:mm", { locale: vi }),
    },
    {
      id: "actions",
      header: "",
      cell: (item) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onView(item)}
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

