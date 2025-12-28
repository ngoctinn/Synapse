"use client";

import { useTableParams } from "@/shared/hooks";
import { Z_INDEX } from "@/shared/lib/design-tokens";
import { TruncatedCell } from "@/shared/lib/table-utils";
import { cn } from "@/shared/lib/utils";
import { DeleteConfirmDialog, showToast } from "@/shared/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";
import { AnimatedUsersIcon } from "@/shared/ui/custom/animated-icon";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
import { Icon } from "@/shared/ui/custom/icon";
import { TableActionBar } from "@/shared/ui/custom/table-action-bar";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/shared/ui/tooltip";
import { Activity, AlertCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCustomer } from "../../actions";
import { Customer } from "../../model/types";
import { CreateCustomerTrigger } from "../create-customer-trigger";
import { CustomerActions } from "../customer-actions";
import { CustomerSheet } from "../customer-sheet";

interface CustomerTableProps {
  data: Customer[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  isLoading?: boolean;
  variant?: "default" | "flush";
}

export function CustomerTable({
  data,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
  isLoading,
  variant = "default",
}: CustomerTableProps) {
  const router = useRouter();
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isPending, startTransition] = useTransition();

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

  const [rowSelection, setRowSelection] = useState({});

  const handleBulkDelete = async () => {
    startTransition(async () => {
      const selectedIds = Object.keys(rowSelection);
      let successCount = 0;
      const failures: string[] = [];

      const results = await Promise.allSettled(
        selectedIds.map((id) => deleteCustomer(id.toString()))
      );

      results.forEach((result, index) => {
        if (
          result.status === "fulfilled" &&
          result.value.status === "success"
        ) {
          successCount++;
        } else {
          failures.push(selectedIds[index].toString());
        }
      });

      if (successCount > 0) {
        showToast.success("Thành công", `Đã xóa ${successCount} khách hàng`);
        setRowSelection({});
        router.refresh();
      }

      if (failures.length > 0) {
        showToast.error(
          "Có lỗi xảy ra",
          `Không thể xóa ${failures.length} khách hàng`
        );
      }

      setShowBulkDeleteDialog(false);
    });
  };

  const columns: Column<Customer>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="pl-4">
            <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
      accessorKey: "full_name",
      cell: ({ row }) => (
        <div className="flex items-center gap-4">
          <Avatar className="h-11 w-11 border">
            <AvatarImage
              src={row.original.avatar_url || undefined}
              alt={row.original.full_name}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {row.original.full_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-foreground group-hover:text-primary text-sm font-semibold transition-colors">
              {row.original.full_name}
            </span>
            <span className="text-muted-foreground text-xs">
              {row.original.email || "Chưa có email"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Số điện thoại",
      accessorKey: "phone_number",
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.phone_number || "--"}</div>
      ),
    },
    {
      header: "Trạng thái",
      accessorKey: "is_active",
      cell: ({ row }) => (
        <Badge preset={row.original.is_active ? "status-active" : "status-inactive"} />
      ),
    },
    {
      header: "Y tế",
      id: "medical",
      cell: ({ row }) => (
        <div className="flex gap-1">
          {row.original.allergies && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger>
                  <Icon icon={AlertCircle} className="text-destructive" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-destructive font-semibold">Dị ứng:</p>
                  <TruncatedCell maxWidth={250}>{row.original.allergies}</TruncatedCell>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {row.original.medical_notes && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger>
                  <Icon icon={Activity} className="text-info" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-info font-semibold">Ghi chú y tế:</p>
                  <TruncatedCell maxWidth={250}>{row.original.medical_notes}</TruncatedCell>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Hành động</div>,
      cell: ({ row }) => (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-end pr-6"
        >
          <CustomerActions
            customer={row.original}
            onEdit={() => setEditingCustomer(row.original)}
          />
        </div>
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
        variant={variant}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection as any}
        getRowId={(row) => row.id.toString()}
        onRowClick={(row) => setEditingCustomer(row)}
        emptyState={
          <DataTableEmptyState
            icon={AnimatedUsersIcon}
            title="Chưa có khách hàng"
            description="Tạo khách hàng mới để bắt đầu quản lý hồ sơ và lịch sử."
            action={<CreateCustomerTrigger />}
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
        entityName={`${Object.keys(rowSelection).length} khách hàng`}
      />

      {editingCustomer && (
        <CustomerSheet
          mode="update"
          customer={editingCustomer}
          open={!!editingCustomer}
          onOpenChange={(open: boolean) => !open && setEditingCustomer(null)}
        />
      )}
      {isPending && (
        <div className={cn(Z_INDEX.loadingOverlay, "bg-background/50 absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px]")}>
          {/* Fix Issue #23: Use Z_INDEX tokens */}
          <Icon icon={Loader2} className="text-primary mb-2 animate-spin" size="xl" />
          {/* Fix Issue #30: Optimize pulse animation */}
          <p className="text-muted-foreground animate-pulse text-sm font-medium will-change-[opacity]">
            Đang xử lý...

          </p>
        </div>
      )}
    </>
  );
}

export function CustomerTableSkeleton() {
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
