"use client";

import { ColumnFiltersState } from "@tanstack/react-table";
import { Loader2, Plus, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { ResourceGroup } from "@/features/resources";
import {
  useBulkAction,
  useTableParams
} from "@/shared/hooks";
import { cn } from "@/shared/lib/utils";
import { Icon } from "@/shared/components";
import { DataTable } from "@/shared/components/data-table";
import { DataTableEmptyState } from "@/shared/components/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/components/data-table-skeleton";
import { DataTableToolbar } from "@/shared/components/data-table-toolbar";
import { DeleteConfirmDialog } from "@/shared/components/delete-confirm-dialog";
import { TableActionBar } from "@/shared/components/table-action-bar";
import { Input } from "@/shared/ui/input";

import { deleteService } from "../actions";
import { Service, ServiceCategory, Skill } from "../model/types";
import { CreateServiceTrigger } from "./create-service-trigger";
import { getServiceColumns } from "./service-columns";
import { ServiceFilter } from "./service-filter";
import { ServiceSheet } from "./service-sheet";

interface ServiceTableProps {
  services: Service[];
  availableSkills: Skill[];
  availableCategories: ServiceCategory[];
  availableResourceGroups: ResourceGroup[];
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  className?: string;
  variant?: "default" | "flush";
  isLoading?: boolean;
  hidePagination?: boolean;
  searchProps?: {
    initialValue: string;
    onSearch: (term: string) => void;
  };
}

export function ServiceTable({
  services,
  availableSkills,
  availableCategories,
  availableResourceGroups,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
  variant = "default",
  isLoading,
  hidePagination,
  searchProps,
}: ServiceTableProps) {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const searchParams = useSearchParams();

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
  } = useBulkAction(deleteService, {
    successMessage: (count) => `Đã xóa ${count} dịch vụ`,
    errorMessage: (count) => `Không thể xóa ${count} dịch vụ`,
  });

  const handleBulkDelete = () => {
    const ids = Object.keys(rowSelection);
    executeBulkDelete(ids, () => setRowSelection({}));
  };

  const columns = useMemo(() => getServiceColumns({
    availableCategories,
    availableResourceGroups,
    onEdit: (service) => setEditingService(service),
  }), [availableCategories, availableResourceGroups]);

  // Create column filters from URL params
  const columnFilters = useMemo<ColumnFiltersState>(() => {
    const filters: ColumnFiltersState = [];
    const duration = searchParams.get("duration");
    const categoryId = searchParams.get("category_id");

    if (duration) filters.push({ id: "duration", value: duration });
    if (categoryId) filters.push({ id: "category_id", value: categoryId });

    return filters;
  }, [searchParams]);

  return (
    <>


      <DataTable
        data={services}
        columns={columns}
        columnFilters={columnFilters}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className={className}
        variant={variant}
        isLoading={isLoading}
        skeletonCount={6}
        hidePagination={hidePagination}
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection as any}
        getRowId={(row) => row.id.toString()}
        onRowClick={(service) => {
          const selection = window.getSelection();
          if (selection && selection.toString().length > 0) return;
          setEditingService(service);
        }}
        toolbar={
          <DataTableToolbar
            searchField={
              searchProps && (
                  <Input
                    placeholder="Tìm kiếm dịch vụ..."
                    defaultValue={searchProps.initialValue}
                    onChange={(e) => searchProps.onSearch(e.target.value)}
                    startContent={
                      <Icon
                        icon={isLoading ? Loader2 : Search}
                        className={cn("text-muted-foreground", isLoading && "animate-spin")}
                        size={16}
                      />
                    }
                    className="w-full"
                  />
              )
            }
            filters={
              <ServiceFilter
                availableCategories={availableCategories}
              />
            }
            actions={
              <CreateServiceTrigger
                availableSkills={availableSkills}
                availableCategories={availableCategories}
                availableResourceGroups={availableResourceGroups}
              />
            }
          />
        }
        emptyState={
          <DataTableEmptyState
            icon={Plus}
            title="Chưa có dịch vụ nào"
            description="Bắt đầu bằng cách tạo dịch vụ đầu tiên của bạn. Dịch vụ sẽ hiển thị trên trang đặt lịch."
            action={
               <CreateServiceTrigger
                  availableSkills={availableSkills}
                  availableCategories={availableCategories}
                  availableResourceGroups={availableResourceGroups}
               />
            }
          />
        }
      />

      <TableActionBar
        selectedCount={Object.keys(rowSelection).length}
        onDelete={() => setShowBulkDeleteDialog(true)}
        onDeselectAll={() => setRowSelection({})}
        isLoading={isPending}
      />

      {/* Edit Sheet */}
      {editingService && (
        <ServiceSheet
          mode="update"
          initialData={editingService}
          open={!!editingService}
          onOpenChange={(open) => !open && setEditingService(null)}
          availableSkills={availableSkills}
          availableCategories={availableCategories}
          availableResourceGroups={availableResourceGroups}
        />
      )}



      <DeleteConfirmDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        onConfirm={handleBulkDelete}
        isDeleting={isPending}
        entityName={`${Object.keys(rowSelection).length} dịch vụ`}
      />
    </>
  );
}

export function ServiceTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={8}
      rowCount={5}
      searchable={false}
      filterable={true}
      showAction={false}
      variant="flush"
    />
  );
}
