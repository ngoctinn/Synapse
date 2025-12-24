"use client";

import { useTableParams } from "@/shared/hooks";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { showToast } from "@/shared/ui";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Phone,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateWaitlistStatus, deleteWaitlistEntry } from "../actions";
import { WaitlistEntry } from "../model/types";
import { WaitlistSheet } from "./waitlist-sheet";
import { Icon } from "@/shared/ui/custom/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface WaitlistTableProps {
  data: WaitlistEntry[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  isLoading?: boolean;
  hidePagination?: boolean;
}

export function WaitlistTable({
  data,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
  isLoading,
  hidePagination,
}: WaitlistTableProps) {
  const router = useRouter();
  const [editingEntry, setEditingEntry] = useState<WaitlistEntry | null>(null);
  const [, startTransition] = useTransition();

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

  const handleStatusUpdate = (id: string, status: WaitlistEntry["status"]) => {
    startTransition(async () => {
      const result = await updateWaitlistStatus(id, status);
      if (result.status === "success") {
        showToast.success("Thành công", `Đã cập nhật trạng thái yêu cầu`);
        router.refresh();
      } else {
        showToast.error("Thất bại", result.message);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa yêu cầu này?")) return;
    startTransition(async () => {
      const result = await deleteWaitlistEntry(id);
      if (result.status === "success") {
        showToast.success("Thành công", "Đã xóa yêu cầu khỏi danh sách");
        router.refresh();
      } else {
        showToast.error("Thất bại", result.message);
      }
    });
  };

  const columns: Column<WaitlistEntry>[] = [
    {
      header: "Khách hàng",
      accessorKey: "customer_name",
      cell: (w) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{w.customer_name}</span>
          <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
            <Icon icon={Phone} size="xs" /> {w.phone_number}
          </div>
        </div>
      ),
    },
    {
      header: "Dịch vụ quan tâm",
      accessorKey: "service_name",
      cell: (w) => <div className="text-sm">{w.service_name}</div>,
    },
    {
      header: "Thời gian mong muốn",
      accessorKey: "preferred_date",
      sortable: true,
      cell: (w) => (
        <div className="flex flex-col text-sm">
          <span>
            {format(new Date(w.preferred_date), "dd/MM/yyyy", { locale: vi })}
          </span>
          <span className="text-muted-foreground text-xs">
            {w.preferred_time_slot}
          </span>
        </div>
      ),
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
          pending: "warning",
          notified: "secondary", // Fixed invalid 'blue'
          converted: "success",
          cancelled: "destructive",
          expired: "secondary",
        };
        const labels: Record<string, string> = {
          pending: "Đang chờ",
          notified: "Đã thông báo",
          converted: "Đã đặt lịch",
          cancelled: "Đã hủy",
          expired: "Hết hạn",
        };
        const presets: Record<string, any> = {
          pending: "appointment-pending",
          notified: "appointment-confirmed",
          converted: "appointment-completed",
          cancelled: "appointment-cancelled",
          expired: "appointment-no-show",
        };
        return <Badge preset={presets[w.status]} />;
      },
    },
    {
      header: "Ghi chú",
      accessorKey: "notes",
      cell: (w) => (
        <div
          className="text-muted-foreground max-w-[200px] truncate text-sm"
          title={w.notes || ""}
        >
          {w.notes || "-"}
        </div>
      ),
    },
    {
      header: "",
      id: "actions",
      cell: (w) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <Icon icon={MoreHorizontal} className="text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(w.id, "notified")}
              >
                <Icon icon={Clock} className="mr-2" size="sm" /> Đã thông báo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(w.id, "converted")}
              >
                <Icon icon={CheckCircle2} className="mr-2" size="sm" /> Chuyển
                thành lịch hẹn
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(w.id, "cancelled")}
                className="text-destructive"
              >
                <Icon icon={XCircle} className="mr-2" size="sm" /> Hủy yêu cầu
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(w.id)}
                className="text-destructive"
              >
                Xóa vĩnh viễn
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
        hidePagination={hidePagination}
        // onRowClick={(w) => setEditingEntry(w)}
        sort={{
          column: sortBy,
          direction: order,
          onSort: handleSort,
        }}
        emptyState={
          <DataTableEmptyState
            icon={CalendarClock}
            title="Danh sách chờ trống"
            description="Chưa có khách hàng nào trong danh sách chờ."
            // action={<CreateWaitlistTrigger />}
          />
        }
      />

      {/* Sheet create/edit placeholder - implemented next */}
      <WaitlistSheet
        mode={editingEntry ? "edit" : "create"}
        open={!!editingEntry}
        onOpenChange={(open: boolean) => !open && setEditingEntry(null)}
        data={editingEntry || undefined}
      />
    </>
  );
}
