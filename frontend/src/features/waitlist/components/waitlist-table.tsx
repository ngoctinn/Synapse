"use client";

import { useTableParams } from "@/shared/hooks";
import { DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { showToast } from "@/shared/ui";
import { CalendarClock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { updateWaitlistStatus, deleteWaitlistEntry } from "../actions";
import { WaitlistEntry } from "../model/types";
import { WaitlistSheet } from "./waitlist-sheet";
import { getWaitlistColumns } from "./waitlist-columns";

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

  const columns = getWaitlistColumns({
    onStatusUpdate: handleStatusUpdate,
    onDelete: handleDelete,
    onEdit: setEditingEntry,
  });

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
          />
        }
      />

      <WaitlistSheet
        mode={editingEntry ? "edit" : "create"}
        open={!!editingEntry}
        onOpenChange={(open: boolean) => !open && setEditingEntry(null)}
        data={editingEntry || undefined}
      />
    </>
  );
}
