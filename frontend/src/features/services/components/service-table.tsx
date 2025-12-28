"use client";

import {
  useBulkAction,
  useTableParams
} from "@/shared/hooks";
import { formatCurrency } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Icon } from "@/shared/ui/custom";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
import { DeleteConfirmDialog } from "@/shared/ui/custom/delete-confirm-dialog";
import { TableActionBar } from "@/shared/ui/custom/table-action-bar";
import { Group, Stack } from "@/shared/ui/layout";
import { Switch } from "@/shared/ui/switch";
import { Text as UIText } from "@/shared/ui/typography";
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

  const getResourceGroupName = (groupId: string) => {
    return MOCK_RESOURCE_GROUPS.find(g => g.id === groupId)?.name || groupId;
  };

  const columns: Column<Service>[] = [
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
      header: "Tên dịch vụ",
      accessorKey: "name",
      cell: ({ row }) => (
        <Stack gap={0}>
          <UIText size="sm" weight="medium" className="group-hover:text-primary transition-colors">
            {row.original.name}
          </UIText>
        </Stack>
      ),
    },
    {
      header: "Danh mục",
      cell: ({ row }) => {
        const category = availableCategories.find(
          (c) => c.id === row.original.category_id
        );
        return category ? (
          <Badge variant="secondary">
            {category.name}
          </Badge>
        ) : (
          <UIText variant="muted" size="xs" className="italic">
            Chưa phân loại
          </UIText>
        );
      },
    },
    {
      header: "Thời lượng",
      cell: ({ row }) => {
        const totalTime = row.original.duration + row.original.buffer_time;
        return (
          <Stack gap={1}>
            <UIText size="xs" weight="medium">
              Tổng: {totalTime}p
            </UIText>
            <UIText size="xs" variant="muted">
              ({row.original.duration}p + {row.original.buffer_time}p nghỉ)
            </UIText>
          </Stack>
        );
      },
    },
    {
      header: "Tài nguyên",
      cell: ({ row }) => {
        const reqs = row.original.resource_requirements || [];
        if (reqs.length === 0) {
            return <UIText variant="muted" size="xs" className="italic">Không yêu cầu</UIText>;
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
      accessorKey: "price",
      cell: ({ row }) => <div className="font-medium text-foreground text-sm">{formatCurrency(row.original.price)}</div>,
    },
    {
       header: "Trạng thái",
       accessorKey: "is_active",
       cell: ({ row }) => (
          <Group align="center" gap={2} onClick={e => e.stopPropagation()}>
             <Switch
                checked={row.original.is_active}
                onCheckedChange={(checked) => handleToggleStatus(row.original, checked)}
             />
             <Badge variant={row.original.is_active ? "status-active" : "status-inactive"} className="px-2 py-0.5 text-[10px]">
                {row.original.is_active ? "Hiện" : "Ẩn"}
             </Badge>
          </Group>
       )
    },
     {
      header: "Hành động",
      id: "actions",
      cell: ({ row }) => (
        <Group justify="end" onClick={(e) => e.stopPropagation()} className="pr-6">
          <ServiceActions
            service={row.original}
            onEdit={() => setEditingService(row.original)}
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
