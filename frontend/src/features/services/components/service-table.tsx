"use client";

import {
  useBulkAction,
  useTableParams
} from "@/shared/hooks";
import { Icon } from "@/shared/ui/custom";
import { DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
import { DataTableToolbar } from "@/shared/ui/custom/data-table-toolbar";
import { DeleteConfirmDialog } from "@/shared/ui/custom/delete-confirm-dialog";
import { TableActionBar } from "@/shared/ui/custom/table-action-bar";
import { Input } from "@/shared/ui/input";
import { Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { deleteService, toggleServiceStatus } from "../actions";
import { MOCK_RESOURCE_GROUPS } from "../model/mocks";
import { Service, ServiceCategory, Skill } from "../model/types";
import { CreateServiceTrigger } from "./create-service-trigger";
import { getServiceColumns } from "./service-columns";
import { ServiceFilter } from "./service-filter";
import { ServiceSheet } from "./service-sheet";

interface ServiceTableProps {
  services: Service[];
  availableSkills: Skill[];
  availableCategories: ServiceCategory[];
  // Removed legacy bed/equipment props
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

  const handleToggleStatus = async (service: Service, checked: boolean) => {
    try {
       await toggleServiceStatus(service.id, checked);
       toast.success(checked ? `Đã kích hoạt "${service.name}"` : `Đã ẩn "${service.name}"`);
    } catch (error) {
       toast.error("Không thể thay đổi trạng thái");
    }
 };

  const columns = useMemo(() => getServiceColumns({
    availableCategories,
    onToggleStatus: handleToggleStatus,
    onEdit: (service) => setEditingService(service),
  }), [availableCategories]);

  return (
    <>


      <DataTable
        data={services}
        columns={columns}
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
        onRowClick={(service) => setEditingService(service)}
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
                        icon={Search}
                        className="text-muted-foreground"
                        size={16}
                      />
                    }
                    className="w-full"
                  />
              )
            }
            filters={
              <ServiceFilter
                availableSkills={availableSkills}
                availableCategories={availableCategories}
              />
            }
            actions={
              <CreateServiceTrigger
                availableSkills={availableSkills}
                availableCategories={availableCategories}
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
          availableResourceGroups={MOCK_RESOURCE_GROUPS}
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
      columnCount={7}
      rowCount={5}
      searchable={false}
      filterable={true}
      showAction={false}
      variant="flush"
    />
  );
}
