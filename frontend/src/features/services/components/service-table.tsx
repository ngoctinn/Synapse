"use client";

import {
    useBulkAction,
    useTableParams,
    useTableSelection,
} from "@/shared/hooks";
import { formatCurrency } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Icon } from "@/shared/ui/custom";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
import { DeleteConfirmDialog } from "@/shared/ui/custom/delete-confirm-dialog";
import { TableActionBar } from "@/shared/ui/custom/table-action-bar";
import { Group, Stack } from "@/shared/ui/layout";
import { Switch } from "@/shared/ui/switch";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteService, toggleServiceStatus } from "../actions";
import { MOCK_RESOURCE_GROUPS } from "../model/mocks";
import { Service, ServiceCategory, Skill } from "../model/types";
import { ServiceActions } from "./service-actions";
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

  const selection = useTableSelection({
    data: services,
    keyExtractor: (item) => item.id,
  });

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
    const ids = Array.from(selection.selectedIds) as string[];
    executeBulkDelete(ids, selection.clearAll);
  };

  const handleToggleStatus = async (service: Service, checked: boolean) => {
    try {
       await toggleServiceStatus(service.id, checked);
       toast.success(checked ? `Đã kích hoạt "${service.name}"` : `Đã ẩn "${service.name}"`);
    } catch (error) {
       toast.error("Không thể thay đổi trạng thái");
    }
 };

  const getResourceGroupName = (groupId: string) => {
    return MOCK_RESOURCE_GROUPS.find(g => g.id === groupId)?.name || groupId;
  };

  const columns: Column<Service>[] = [
    {
      header: "Tên dịch vụ",
      cell: (service) => (
        <Stack gap={0}>
          <span className="text-foreground group-hover:text-primary text-sm font-medium transition-colors">
            {service.name}
          </span>
        </Stack>
      ),
    },
    {
      header: "Danh mục",
      cell: (service) => {
        const category = availableCategories.find(
          (c) => c.id === service.category_id
        );
        return category ? (
          <Badge variant="secondary">
            {category.name}
          </Badge>
        ) : (
          <span className="text-muted-foreground text-xs italic">
            Chưa phân loại
          </span>
        );
      },
    },
    {
      header: "Thời lượng",
      cell: (service) => {
        const totalTime = service.duration + service.buffer_time;
        return (
          <Stack gap={1} className="text-xs">
            <span className="text-foreground font-medium">
              Tổng: {totalTime}p
            </span>
            <span className="text-muted-foreground">
              ({service.duration}p + {service.buffer_time}p nghỉ)
            </span>
          </Stack>
        );
      },
    },
    {
      header: "Tài nguyên",
      cell: (service) => {
        const reqs = service.resource_requirements || [];
        if (reqs.length === 0) {
            return <span className="text-muted-foreground text-xs italic">Không yêu cầu</span>;
        }

        return (
          <Group wrap gap={1}>
             {reqs.map((req, idx) => (
                 <Badge key={idx} variant="outline" className="text-xs font-normal">
                    {req.quantity}x {getResourceGroupName(req.group_id)}
                 </Badge>
             ))}
          </Group>
        );
      },
    },
    {
      header: "Giá",
      className: "font-medium text-foreground text-sm",
      cell: (service) => formatCurrency(service.price),
    },
    {
       header: "Trạng thái",
       cell: (service) => (
          <Group align="center" gap={2} onClick={e => e.stopPropagation()}>
             <Switch
                checked={service.is_active}
                onCheckedChange={(checked) => handleToggleStatus(service, checked)}
             />
             <Badge variant={service.is_active ? "status-active" : "status-inactive"} className="px-2 py-0.5 text-[10px]">
                {service.is_active ? "Hiện" : "Ẩn"}
             </Badge>
          </Group>
       )
    },
     {
      header: "Hành động",
      className: "pr-6 text-right",
      cell: (service) => (
        <Group justify="end" onClick={(e) => e.stopPropagation()}>
          <ServiceActions
            service={service}
            onEdit={() => setEditingService(service)}
          />
        </Group>
      ),
    },
  ];

  return (
    <>
        <Group justify="end" className="mb-4">
           <Button onClick={() => setIsCreateOpen(true)} startContent={<Icon icon={Plus} />}>
              Thêm dịch vụ
           </Button>
        </Group>

      <DataTable
        data={services}
        columns={columns}
        keyExtractor={(service) => service.id}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className={className}
        variant={variant}
        isLoading={isLoading}
        skeletonCount={6}
        hidePagination={hidePagination}
        selection={{
          isSelected: selection.isSelected,
          onToggleOne: (id) => !isPending && selection.toggleOne(id),
          onToggleAll: () => !isPending && selection.toggleAll(),
          isAllSelected: selection.isAllSelected,
          isPartiallySelected: selection.isPartiallySelected,
        }}
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
        selectedCount={selection.selectedCount}
        onDelete={() => setShowBulkDeleteDialog(true)}
        onDeselectAll={selection.clearAll}
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
        entityName={`${selection.selectedCount} dịch vụ`}
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
