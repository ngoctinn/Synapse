"use client";

import { useTableParams, useTableSelection } from "@/shared/hooks";
import { DeleteConfirmDialog, showToast } from "@/shared/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
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

  const selection = useTableSelection({
    data,
    keyExtractor: (item) => item.id,
  });

  const handleBulkDelete = async () => {
    startTransition(async () => {
      const selectedIds = Array.from(selection.selectedIds);
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
        selection.clearAll();
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
      header: "Khách hàng",
      accessorKey: "full_name",
      sortable: true,
      cell: (customer) => (
        <div className="flex items-center gap-4">
          <Avatar className="h-11 w-11 border">
            <AvatarImage
              src={customer.avatar_url || undefined}
              alt={customer.full_name}
            />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {customer.full_name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {customer.full_name}
            </span>
            <span className="text-xs text-muted-foreground">
              {customer.email || "Chưa có email"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Số điện thoại",
      accessorKey: "phone_number",
      cell: (c) => (
        <div className="text-sm font-mono">{c.phone_number || "--"}</div>
      ),
    },
    {
      header: "Trạng thái",
      accessorKey: "is_active",
      cell: (c) => (
        <Badge variant={c.is_active ? "success" : "secondary"}>
          {c.is_active ? "Hoạt động" : "Ngưng"}
        </Badge>
      ),
    },
    {
      header: "Y tế",
      cell: (c) => (
        <div className="flex gap-1">
          {c.allergies && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertCircle className="size-4 text-destructive" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold text-destructive">Dị ứng:</p>
                  <p>{c.allergies}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {c.medical_notes && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Activity className="size-4 text-info" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold text-info">Ghi chú y tế:</p>
                  <p>{c.medical_notes}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      ),
    },
    {
      header: "Hành động",
      className: "pr-6 text-right",
      cell: (customer) => (
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-end"
        >
          <CustomerActions
            customer={customer}
            onEdit={() => setEditingCustomer(customer)}
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
        keyExtractor={(item) => item.id}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className={className}
        isLoading={isLoading}
        skeletonCount={5}
        variant={variant}
        selection={{
          isSelected: selection.isSelected,
          onToggleOne: selection.toggleOne,
          onToggleAll: selection.toggleAll,
          isAllSelected: selection.isAllSelected,
          isPartiallySelected: selection.isPartiallySelected,
        }}
        onRowClick={(c) => setEditingCustomer(c)}
        sort={{
          column: sortBy,
          direction: order,
          onSort: handleSort,
        }}
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
        entityName={`${selection.selectedCount} khách hàng`}
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
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/50 backdrop-blur-[2px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
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
