"use client";

import { useBulkAction, useTableParams, useTableSelection } from "@/shared/hooks";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Badge } from "@/shared/ui/badge";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
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
  isLoading?: boolean;
}

export function SkillTable({
  skills,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
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
        <Badge variant="outline" size="sm" className="font-mono">
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
      header: "Thao tác",
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

      <AlertDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xóa {selection.selectedCount} kỹ năng?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Các kỹ năng sẽ bị gỡ khỏi dịch vụ và nhân viên liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? "Đang xóa..." : `Xóa ${selection.selectedCount} mục`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
