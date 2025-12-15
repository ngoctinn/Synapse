"use client";

import { Skill } from "@/features/services/types";
import { deleteStaff } from "@/features/staff/actions";
import { useTableParams, useTableSelection } from "@/shared/hooks";
import { DeleteConfirmDialog, showToast } from "@/shared/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { AnimatedUsersIcon } from "@/shared/ui/custom/animated-icon";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
import { TableActionBar } from "@/shared/ui/custom/table-action-bar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { Calendar, Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { ROLE_CONFIG } from "../../model/constants";
import { Staff } from "../../model/types";
import { InviteStaffTrigger } from "../invite-staff-trigger";
import { StaffSheet } from "../staff-sheet";
import { StaffActions } from "./staff-actions";

interface StaffTableProps {
  data: Staff[];
  skills: Skill[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  variant?: "default" | "flush";
  isLoading?: boolean;
}

const GroupActionButtons = ({ staff: _staff }: { staff: Staff }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleViewSchedule = () => {
    const params = new URLSearchParams(searchParams);
    params.set("view", "scheduling");
    // Optionally pass staff_id to focus in scheduler (if supported)
    // params.set("staff_id", staff.user_id)
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
            onClick={handleViewSchedule}
          >
            <Calendar className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Xem lịch làm việc</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function StaffTable({
  data,
  skills,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
  variant = "default",
  isLoading,
}: StaffTableProps) {
  const router = useRouter();
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

  // Use custom hook for URL state management
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

  // Support both controlled and uncontrolled modes
  const page = pageProp ?? urlPage;
  const handlePageChange = onPageChangeProp ?? urlPageChange;

  const selection = useTableSelection({
    data,
    keyExtractor: (item) => item.user_id,
  });

  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleBulkDelete = () => {
    const ids = Array.from(selection.selectedIds) as string[];
    if (ids.length === 0) return;

    startTransition(async () => {
      try {
        const results = await Promise.allSettled(
          ids.map((id) => deleteStaff(id))
        );

        const successCount = results.filter(
          (r) => r.status === "fulfilled" && r.value.status === "success"
        ).length;
        const failures = results.filter(
          (r) =>
            r.status === "rejected" ||
            (r.status === "fulfilled" && r.value.status !== "success")
        );

        if (successCount > 0) {
          showToast.success("Thành công", `Đã xóa ${successCount} nhân viên`);
          selection.clearAll();
          router.refresh();
        }

        if (failures.length > 0) {
          showToast.error("Lỗi", `Không thể xóa ${failures.length} nhân viên`);
        }
      } catch (error) {
        console.error(error);
        showToast.error("Lỗi", "Không thể xóa nhân viên");
      } finally {
        setShowBulkDeleteDialog(false);
      }
    });
  };

  const columns: Column<Staff>[] = [
    {
      header: "Nhân viên",
      accessorKey: "user.full_name",
      id: "user.full_name",
      sortable: true,
      cell: (staff) => (
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage
              src={staff.user.avatar_url || undefined}
              alt={staff.user.full_name || ""}
            />
            <AvatarFallback
              className="font-medium text-white shadow-sm"
              style={{
                backgroundColor: staff.color_code || "hsl(var(--primary))",
              }}
            >
              {(staff.user.full_name || staff.user.email || "?")
                .charAt(0)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-lg font-serif text-foreground group-hover:text-primary transition-colors tracking-tight">
              {staff.user.full_name || "Chưa cập nhật tên"}
            </span>
            <span className="text-xs text-muted-foreground">
              {staff.user.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Vai trò",
      accessorKey: "user.role",
      id: "user.role",
      sortable: true,
      cell: (staff) => (
        <Badge
          variant={ROLE_CONFIG[staff.user.role]?.variant || "outline"}
          size="sm"
        >
          {ROLE_CONFIG[staff.user.role]?.label || staff.user.role}
        </Badge>
      ),
    },
    {
      header: "Kỹ năng",
      cell: (staff) => (
        <div className="flex flex-wrap gap-2">
          {staff.skills.length > 0 ? (
            <>
              {staff.skills.slice(0, 2).map((skill) => (
                <Badge key={skill.id} variant="violet" size="sm">
                  {skill.name}
                </Badge>
              ))}
              {staff.skills.length > 2 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="violet" size="sm">
                        +{staff.skills.length - 2} nữa
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="flex flex-col gap-1">
                        {staff.skills.slice(2).map((skill) => (
                          <span key={skill.id}>{skill.name}</span>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic pl-1">
              --
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Trạng thái",
      cell: (staff) => (
        <Badge
          variant={staff.user.is_active ? "status-active" : "status-inactive"}
          withIndicator
          indicatorPulse={staff.user.is_active}
          size="sm"
        >
          {staff.user.is_active ? "Hoạt động" : "Ẩn"}
        </Badge>
      ),
    },
    {
      header: "Hành động",
      className: "pr-6 text-right",
      cell: (staff) => (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-end gap-2"
        >
          <GroupActionButtons staff={staff} />
          <StaffActions staff={staff} onEdit={() => setEditingStaff(staff)} />
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        keyExtractor={(staff) => staff.user_id}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className={className}
        variant={variant}
        isLoading={isLoading}
        skeletonCount={5}
        disabled={isPending}
        selection={{
          isSelected: selection.isSelected,
          onToggleOne: selection.toggleOne,
          onToggleAll: selection.toggleAll,
          isAllSelected: selection.isAllSelected,
          isPartiallySelected: selection.isPartiallySelected,
        }}
        sort={{
          column: sortBy,
          direction: order,
          onSort: handleSort,
        }}
        onRowClick={(staff) => setEditingStaff(staff)}
        emptyState={
          <DataTableEmptyState
            icon={AnimatedUsersIcon}
            title="Chưa có nhân viên nào"
            description="Danh sách nhân viên hiện đang trống."
            action={<InviteStaffTrigger skills={skills} />}
          />
        }
      />
      {isPending && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[2px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Đang xử lý...
          </p>
        </div>
      )}

      <TableActionBar
        selectedCount={selection.selectedCount}
        onDelete={() => setShowBulkDeleteDialog(true)}
        onDeselectAll={selection.clearAll}
        isLoading={isPending}
      />

      <DeleteConfirmDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        isDeleting={isPending}
        entityName={`${selection.selectedCount} nhân viên`}
      />

      {editingStaff && (
        <StaffSheet
          mode="update"
          staff={editingStaff}
          skills={skills}
          open={!!editingStaff}
          onOpenChange={(open) => !open && setEditingStaff(null)}
        />
      )}
    </>
  );
}

export function StaffTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={6}
      rowCount={5}
      searchable={false}
      filterable={false}
      showAction={false}
      variant="flush"
    />
  );
}
