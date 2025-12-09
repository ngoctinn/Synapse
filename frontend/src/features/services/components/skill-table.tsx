"use client";

import { useTableSelection } from "@/shared/hooks/use-table-selection";
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
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
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
  page = 1,
  totalPages = 1,
  onPageChange,
  className,
  isLoading,
}: SkillTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [isPending, startTransition] = useTransition();


  const selection = useTableSelection({
    data: skills,
    keyExtractor: (item) => item.id,
  });

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };


  const handleBulkDelete = async () => {
    const ids = Array.from(selection.selectedIds) as string[];
    if (ids.length === 0) return;

    startTransition(async () => {
      try {
        let successCount = 0;
        for (const id of ids) {
          try {
            const result = await deleteSkill(id);
            if (result.success) successCount++;
          } catch (e) {
            console.error(`Failed to delete ${id}:`, e);
          }
        }

        if (successCount > 0) {
          toast.success(`Đã xóa ${successCount} kỹ năng`);
          selection.clearAll();
        }
        if (successCount < ids.length) {
          toast.error(`Không thể xóa ${ids.length - successCount} kỹ năng`);
        }
      } catch (error) {
        console.error(error);
        toast.error("Không thể xóa kỹ năng");
      } finally {
        setShowBulkDeleteDialog(false);
      }
    });
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
        <Badge variant="outline" className="font-mono text-xs bg-muted/50 text-muted-foreground border-border">
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

        selectable
        isSelected={selection.isSelected}
        onToggleOne={selection.toggleOne}
        onToggleAll={selection.toggleAll}
        isAllSelected={selection.isAllSelected}
        isPartiallySelected={selection.isPartiallySelected}
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
    />
  );
}
