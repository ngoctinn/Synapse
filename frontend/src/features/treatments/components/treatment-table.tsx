"use client";

import { useTableParams } from "@/shared/hooks";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { Progress } from "@/shared/ui/progress";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { checkInSession } from "../actions";
import { CustomerTreatment } from "../model/types";
import { TreatmentSheet } from "./treatment-sheet";
import { showToast } from "@/shared/ui";

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
      header: "Khách hàng",
      accessorKey: "customer_name",
      sortable: true,
      cell: (t) => (
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{t.customer_name}</span>
          <span className="text-muted-foreground text-xs">
            ID: {t.customer_id}
          </span>
        </div>
      ),
    },
    {
      header: "Gói dịch vụ",
      accessorKey: "package_name",
      cell: (t) => <div className="text-sm font-medium">{t.package_name}</div>,
    },
    {
      header: "Tiến độ",
      accessorKey: "progress",
      sortable: true,
      cell: (t) => (
        <div className="flex w-[140px] flex-col gap-1.5">
          <div className="flex justify-between text-xs">
            <span>
              {t.sessions_completed}/{t.total_sessions} buổi
            </span>
            <span className="text-muted-foreground">
              {Math.round(t.progress)}%
            </span>
          </div>
          <Progress value={t.progress} className="h-2" />
        </div>
      ),
    },
    {
      header: "Ngày đăng ký",
      accessorKey: "start_date",
      sortable: true,
      cell: (t) => {
        const date = new Date(t.start_date).toLocaleDateString("vi-VN");
        return <div className="text-muted-foreground text-sm">{date}</div>;
      },
    },
    {
      header: "Trạng thái",
      accessorKey: "status",
      cell: (t) => {
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
          <Badge variant={variants[t.status] || "outline"}>
            {labels[t.status] || t.status}
          </Badge>
        );
      },
    },
    {
      header: "Thao tác",
      className: "text-right",
      cell: (t) => (
        <div className="flex justify-end gap-2">
          {t.status === "active" && (
            <Button
              size="sm"
              variant="outline"
              className="h-8"
              onClick={(e) => {
                e.stopPropagation();
                handleCheckIn(t.id);
              }}
              disabled={isPending}
            >
              <CheckCircle2 className="mr-1 size-3.5" />
              Check-in
            </Button>
          )}
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
        onRowClick={(t) => setEditingTreatment(t)}
        sort={{
          column: sortBy,
          direction: order,
          onSort: handleSort,
        }}
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
