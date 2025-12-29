"use client";

import { AnimatedUsersIcon } from "@/shared/components/animated-icon";
import { Column, DataTable } from "@/shared/components/data-table";
import { DataTableEmptyState } from "@/shared/components/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/components/data-table-skeleton";
import { DataTableToolbar } from "@/shared/components/data-table-toolbar";
import { DeleteConfirmDialog } from "@/shared/components/delete-confirm-dialog";
import { Icon } from "@/shared/components/icon";
import { TableActionBar } from "@/shared/components/table-action-bar";
import { useTableParams } from "@/shared/hooks";
import { Z_INDEX } from "@/shared/lib/design-tokens";
import { TruncatedCell } from "@/shared/lib/table-utils";
import { cn } from "@/shared/lib/utils";
import { showToast } from "@/shared/components/sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { RowSelectionState } from "@tanstack/react-table";
import { Activity, AlertCircle, Loader2, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteCustomer } from "../../actions";
import { Customer } from "../../model/types";
import { CreateCustomerTrigger } from "../create-customer-trigger";
import { CustomerActions } from "../customer-actions";
import { CustomerFilter } from "../customer-filter";
import { CustomerSheet } from "../customer-sheet";

interface CustomerTableProps {
  data: Customer[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  isLoading?: boolean;
  variant?: "default" | "flush";
  searchProps?: {
    initialValue: string;
    onSearch: (term: string) => void;
  };
}

export function CustomerTable({
  data,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
  isLoading,
  variant = "default",
  searchProps,
}: CustomerTableProps) {
  const router = useRouter();
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isPending, startTransition] = useTransition();

  const { page: urlPage, handlePageChange: urlPageChange } = useTableParams({
    defaultSortBy: "created_at",
    defaultOrder: "desc",
  });

  const page = pageProp ?? urlPage;
  const handlePageChange = onPageChangeProp ?? urlPageChange;

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

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
      meta: { align: "right" },
      cell: ({ row }) => (
        <div className="font-mono text-sm">
          {row.original.phone_number || "--"}
        </div>
      ),
    },
    {
      header: "Trạng thái",
      accessorKey: "is_active",
      meta: { align: "center" },
      cell: ({ row }) => (
        <Badge
          preset={row.original.is_active ? "status-active" : "status-inactive"}
        />
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
                  <TruncatedCell maxWidth={250}>
                    {row.original.allergies}
                  </TruncatedCell>
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
                  <TruncatedCell maxWidth={250}>
                    {row.original.medical_notes}
                  </TruncatedCell>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "Hành động",
      meta: { align: "right" },
      cell: ({ row }) => (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-end"
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
        toolbar={
          <DataTableToolbar
            searchField={
              searchProps && (
                <Input
                  placeholder="Tìm kiếm khách hàng..."
                  defaultValue={searchProps.initialValue}
                  onChange={(e) => searchProps.onSearch(e.target.value)}
                  startContent={
                    <Search className="text-muted-foreground" size={16} />
                  }
                  className="w-full"
                />
              )
            }
            filters={<CustomerFilter />}
            actions={<CreateCustomerTrigger />}
          />
        }
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection}
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
        <div
          className={cn(
            Z_INDEX.loadingOverlay,
            "bg-background/50 absolute inset-0 flex flex-col items-center justify-center backdrop-blur-[2px]"
          )}
        >
          <Icon
            icon={Loader2}
            className="text-primary mb-2 animate-spin"
            size="xl"
          />
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
