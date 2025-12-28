import {
    useBulkAction,
    useTableParams
} from "@/shared/hooks";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
import { DeleteConfirmDialog } from "@/shared/ui/custom/delete-confirm-dialog";
import { TableActionBar } from "@/shared/ui/custom/table-action-bar";
import { Box } from "@/shared/ui/layout";
import { Text as UIText } from "@/shared/ui/typography";
import { Plus } from "lucide-react";
import { useState } from "react";
import { deleteSkill } from "../actions";
import { Skill } from "../model/types";
import { CreateSkillSheet } from "./create-skill-sheet";
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

  const [rowSelection, setRowSelection] = useState({});

  // Use custom hook for bulk delete
  const {
    execute: executeBulkDelete,
    isPending,
    showDialog: showBulkDeleteDialog,
    setShowDialog: setShowBulkDeleteDialog,
  } = useBulkAction(deleteSkill, {
    successMessage: (count) => `Đã xóa ${count} kỹ năng`,
    errorMessage: (count) => `Không thể xóa ${count} kỹ năng`,
  });

  const handleBulkDelete = () => {
    const ids = Object.keys(rowSelection);
    executeBulkDelete(ids, () => setRowSelection({}));
  };

  const columns: Column<Skill>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Box pl={4}>
            <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
            />
        </Box>
      ),
      cell: ({ row }) => (
        <Box pl={4}>
            <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
            />
        </Box>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      header: "Tên kỹ năng",
      accessorKey: "name",
      cell: ({ row }) => (
        <UIText weight="medium" className="group-hover:text-primary transition-colors">
          {row.original.name}
        </UIText>
      ),
    },
    {
      header: "Mã kỹ năng",
      accessorKey: "code",
      cell: ({ row }) => (
        <Badge variant="outline" size="sm">
          {row.original.code}
        </Badge>
      ),
    },
    {
      header: "Mô tả",
      accessorKey: "description",
      cell: ({ row }) => (
        <UIText variant="muted" className="block max-w-md truncate">
          {row.original.description || "-"}
        </UIText>
      ),
    },
    {
      header: "Hành động",
      id: "actions",
      cell: ({ row }) => <SkillActions skill={row.original} />,
    },
  ];

  return (
    <>
      <DataTable
        data={skills}
        columns={columns}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className={className}
        variant={variant}
        isLoading={isLoading}
        skeletonCount={5}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection as any}
        getRowId={(row) => row.id.toString()}
        emptyState={
          <DataTableEmptyState
            icon={Plus}
            title="Chưa có kỹ năng nào"
            description="Tạo kỹ năng mới để gán cho dịch vụ và nhân viên."
            action={<CreateSkillSheet />}
          />
        }
      />

      <TableActionBar
        selectedCount={Object.keys(rowSelection).length}
        onDelete={() => setShowBulkDeleteDialog(true)}
        onDeselectAll={() => setRowSelection({})}
        isLoading={isPending}
      />

      <DeleteConfirmDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        isDeleting={isPending}
        entityName={`${Object.keys(rowSelection).length} kỹ năng`}
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
