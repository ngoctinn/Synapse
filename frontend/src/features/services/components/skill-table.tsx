"use client";

import { useBulkAction, useTableParams, useTableSelection } from "@/shared/hooks";
import { Badge } from "@/shared/ui/badge";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
import { DeleteConfirmDialog } from "@/shared/ui/custom/delete-confirm-dialog";
import { TableActionBar } from "@/shared/ui/custom/table-action-bar";
import { Plus } from "lucide-react";
import { deleteSkill } from "../actions";
import { Skill } from "../types";
import { CreateSkillDialog } from "./create-skill-dialog";
import { SkillActions } from "./skill-actions";

interface SkillTableProps {
  skills: Skill[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  variant?: "default" | "flush";
  isLoading?: boolean;
}

export function SkillTable({
  skills,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
  variant = "default",
  isLoading,
}: SkillTableProps) {
  // Use custom hook for URL state management
  const { page: urlPage, handlePageChange: urlPageChange } = useTableParams();

  // Support both controlled and uncontrolled modes
  const page = pageProp ?? urlPage;
  const handlePageChange = onPageChangeProp ?? urlPageChange;

  const selection = useTableSelection({
    data: skills,
    keyExtractor: (item) => item.id,
  });

  // Use custom hook for bulk delete
  const { execute: executeBulkDelete, isPending, showDialog: showBulkDeleteDialog, setShowDialog: setShowBulkDeleteDialog } = useBulkAction(
    deleteSkill,
    {
      successMessage: (count) => `Đã xóa ${count} kỹ năng`,
      errorMessage: (count) => `Không thể xóa ${count} kỹ năng`,
    }
  );

  const handleBulkDelete = () => {
    const ids = Array.from(selection.selectedIds) as string[];
    executeBulkDelete(ids, selection.clearAll);
  };

  const columns: Column<Skill>[] = [

    {
      header: "Tên kỹ năng",
      cell: (skill) => (
        <span className="text-lg font-serif text-foreground group-hover:text-primary transition-colors tracking-tight">
          {skill.name}
        </span>
      ),
    },
    {
      header: "Mã kỹ năng",
      cell: (skill) => (
        <Badge variant="outline" size="sm">
          {skill.code}
        </Badge>
      ),
    },
    {
      header: "Mô tả",
      cell: (skill) => (
        <span className="text-muted-foreground max-w-md truncate block">
          {skill.description || "-"}
        </span>
      ),
    },
    {
      header: "Hành động",
      className: "pr-6 text-right",
      cell: (skill) => <SkillActions skill={skill} />,
    },
  ];

  return (
    <>
      <DataTable
        data={skills}
        columns={columns}
        keyExtractor={(skill) => skill.id}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className={className}
        variant={variant}
        isLoading={isLoading}
        skeletonCount={5}

        selection={{
          isSelected: selection.isSelected,
          onToggleOne: selection.toggleOne,
          onToggleAll: selection.toggleAll,
          isAllSelected: selection.isAllSelected,
          isPartiallySelected: selection.isPartiallySelected,
        }}
        emptyState={
          <DataTableEmptyState
            icon={Plus}
            title="Chưa có kỹ năng nào"
            description="Tạo kỹ năng mới để gán cho dịch vụ và nhân viên."
            action={<CreateSkillDialog />}
          />
        }
      />

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
        entityName={`${selection.selectedCount} kỹ năng`}
      />
    </>
  );
}

export function SkillTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={5}
      rowCount={5}
      searchable={false}
      filterable={false}
      showAction={false}
      variant="flush"
    />
  );
}
