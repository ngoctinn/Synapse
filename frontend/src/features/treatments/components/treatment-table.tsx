"use client";

import { useTableParams } from "@/shared/hooks";
import { showToast } from "@/shared/ui";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Column, DataTable } from "@/shared/components/data-table";
import { DataTableEmptyState } from "@/shared/components/data-table-empty-state";
import { Group, Stack } from "@/shared/ui/layout";
import { Progress } from "@/shared/ui/progress";
import { RowSelectionState } from "@tanstack/react-table";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { checkInSession } from "../actions";
import { CustomerTreatment } from "../model/types";
import { TreatmentSheet } from "./treatment-sheet";

interface TreatmentTableProps {
  data: CustomerTreatment[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  isLoading?: boolean;
}

export function TreatmentTable({
  data,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
  isLoading,
}: TreatmentTableProps) {
  const router = useRouter();
  const [editingTreatment, setEditingTreatment] =
    useState<CustomerTreatment | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isPending, startTransition] = useTransition();

  const {
    page: urlPage,
    sortBy: _sortBy,
    order: _order,
    handlePageChange: urlPageChange,
    handleSort: _handleSort,
  } = useTableParams({
    defaultSortBy: "created_at",
    defaultOrder: "desc",
  });

  const page = pageProp ?? urlPage;
  const handlePageChange = onPageChangeProp ?? urlPageChange;

  const handleCheckIn = (id: string) => {
    startTransition(async () => {
      const result = await checkInSession(id);
      if (result.status === "success") {
        showToast.success("Thành công", "Đã điểm danh buổi liệu trình");
        router.refresh();
      } else {
        showToast.error("Thất bại", result.message);
      }
    });
  };

  const columns: Column<CustomerTreatment>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="pl-4">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
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
      header: "Khách hàng",
      accessorKey: "customer_name",
      enableSorting: true,
      cell: ({ row }) => (
        <Stack gap={0}>
          <span className="font-semibold">{row.original.customer_name}</span>
          <span className="text-muted-foreground text-xs">
            ID: {row.original.customer_id}
          </span>
        </Stack>
      ),
    },
    {
      header: "Gói dịch vụ",
      accessorKey: "package_name",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.package_name}</div>
      ),
    },
    {
      header: "Tiến độ",
      accessorKey: "progress",
      enableSorting: true,
      cell: ({ row }) => (
        <Stack gap={1.5} className="w-36">
          <Group justify="between" className="text-xs">
            <span>
              {row.original.sessions_completed}/{row.original.total_sessions}{" "}
              buổi
            </span>
            <span className="text-muted-foreground">
              {Math.round(row.original.progress)}%
            </span>
          </Group>
          <Progress value={row.original.progress} />
        </Stack>
      ),
    },
    {
      header: "Ngày đăng ký",
      accessorKey: "start_date",
      enableSorting: true,
      cell: ({ row }) => {
        const date = new Date(row.original.start_date).toLocaleDateString(
          "vi-VN"
        );
        return <div className="text-muted-foreground">{date}</div>;
      },
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      cell: ({ row }) => {
        const variants: Record<
          string,
          "default" | "secondary" | "destructive" | "outline" | "success"
        > = {
          active: "success",
          completed: "default",
          cancelled: "destructive",
          expired: "secondary",
        };
        const labels: Record<string, string> = {
          active: "Đang thực hiện",
          completed: "Hoàn tất",
          cancelled: "Đã hủy",
          expired: "Hết hạn",
        };
        return (
          <Badge variant={variants[row.original.status] || "outline"}>
            {labels[row.original.status] || row.original.status}
          </Badge>
        );
      },
    },
    {
      header: "Thao tác",
      id: "actions",
      cell: ({ row }) => (
        <Group justify="end" gap={2}>
          {row.original.status === "active" && (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handleCheckIn(row.original.id);
              }}
              disabled={isPending}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Check-in
            </Button>
          )}
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
        onRowSelectionChange={setRowSelection}
        getRowId={(row) => row.id}
        onRowClick={(t) => setEditingTreatment(t)}
        emptyState={
          <DataTableEmptyState
            icon={ClipboardList}
            title="Chưa có liệu trình"
            description="Đăng ký liệu trình mới cho khách hàng."
            // action={<CreateTreatmentTrigger />} // Sẽ thêm sau
          />
        }
      />

      {editingTreatment && (
        <TreatmentSheet
          mode="view"
          data={editingTreatment}
          open={!!editingTreatment}
          onOpenChange={(open) => !open && setEditingTreatment(null)}
        />
      )}
    </>
  );
}
