"use client";

import {
  useBulkAction,
  useTableParams
} from "@/shared/hooks";
import { Button } from "@/shared/ui/button";
import { Icon } from "@/shared/ui/custom";
import { DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
import { DeleteConfirmDialog } from "@/shared/ui/custom/delete-confirm-dialog";
import { TableActionBar } from "@/shared/ui/custom/table-action-bar";
import { Group } from "@/shared/ui/layout";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { deleteService, toggleServiceStatus } from "../actions";
import { MOCK_RESOURCE_GROUPS } from "../model/mocks";
import { Service, ServiceCategory, Skill } from "../model/types";
import { getServiceColumns } from "./service-columns";
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
}: ServiceTableProps) {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

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
        <Group justify="end" mb={4}>
           <Button onClick={() => setIsCreateOpen(true)} startContent={<Icon icon={Plus} />}>
              Thêm dịch vụ
           </Button>
        </Group>

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
        emptyState={
          <DataTableEmptyState
            icon={Plus}
            title="Chưa có dịch vụ nào"
            description="Bắt đầu bằng cách tạo dịch vụ đầu tiên của bạn. Dịch vụ sẽ hiển thị trên trang đặt lịch."
            action={
               <Button onClick={() => setIsCreateOpen(true)}>
                  Tạo dịch vụ ngay
               </Button>
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

      {/* Create Sheet */}
      <ServiceSheet
         mode="create"
         open={isCreateOpen}
         onOpenChange={setIsCreateOpen}
         availableSkills={availableSkills}
         availableCategories={availableCategories}
         availableResourceGroups={MOCK_RESOURCE_GROUPS}
      />

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
