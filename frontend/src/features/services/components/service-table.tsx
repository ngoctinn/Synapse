"use client";

import { Resource, BedType } from "@/features/resources";
import {
  useBulkAction,
  useTableParams,
  useTableSelection,
} from "@/shared/hooks";
import { formatCurrency } from "@/shared/lib/utils";
import { TruncatedCell } from "@/shared/lib/table-utils";
import { Z_INDEX } from "@/shared/lib/design-tokens";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton";
import { DeleteConfirmDialog } from "@/shared/ui/custom/delete-confirm-dialog";
import { TableActionBar } from "@/shared/ui/custom/table-action-bar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { Plus } from "lucide-react";
import { useState } from "react";
import { deleteService } from "../actions";
import { MOCK_CATEGORIES } from "../model/mocks";
import { Service, Skill } from "../model/types";
import { CreateServiceWizard } from "./create-service-wizard";
import { ServiceActions } from "./service-actions";
import { ServiceSheet } from "./service-sheet";

interface ServiceTableProps {
  services: Service[];
  availableSkills: Skill[];
  availableBedTypes: BedType[];
  availableEquipment: Resource[];
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
  availableBedTypes,
  availableEquipment,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
  variant = "default",
  isLoading,
  hidePagination,
}: ServiceTableProps) {
  const [editingService, setEditingService] = useState<Service | null>(null);

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

  const columns: Column<Service>[] = [
    {
      header: "Tên dịch vụ",
      cell: (service) => (
        <div className="flex flex-col">
          {/* Fix Issue #13: Truncate long service names */}
          <TruncatedCell maxWidth={200} className="text-foreground group-hover:text-primary font-serif text-lg tracking-tight transition-colors">
            {service.name}
          </TruncatedCell>
        </div>
      ),
    },
    {
      header: "Danh mục",
      cell: (service) => {
        const category = MOCK_CATEGORIES.find(
          (c) => c.id === service.category_id
        );
        return category ? (
          <Badge variant="secondary" className="font-normal">
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
          <div className="flex flex-col gap-1 text-xs">
            <span className="text-foreground font-medium">
              Tổng: {totalTime}p
            </span>
            <span className="text-muted-foreground">
              ({service.duration}p + {service.buffer_time}p nghỉ)
            </span>
          </div>
        );
      },
    },
    {
      header: "Loại giường",
      cell: (service) => {
        const bedType = availableBedTypes.find(
          (b) => b.id === service.resource_requirements?.bed_type_id
        );
        return bedType ? (
          <Badge variant="outline" className="font-normal">
            {bedType.name}
          </Badge>
        ) : (
          <span className="text-destructive text-xs italic">
            Chưa gán
          </span>
        );
      },
    },
    {
      header: "Giá",
      className: "font-medium text-foreground text-base",
      cell: (service) => formatCurrency(service.price),
    },
    {
      header: "Kỹ năng yêu cầu",
      cell: (service) => (
        <div className="flex flex-wrap gap-2">
          {service.skills.map((skill) => (
            <Badge key={skill.id} variant="violet">
              {skill.name}
            </Badge>
          ))}
          {service.skills.length === 0 && (
            <span className="text-muted-foreground pl-1 text-xs italic">
              Không yêu cầu
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Trạng thái",
      cell: (service) => (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span>
                <Badge
                  variant={
                    service.is_active ? "status-active" : "status-inactive"
                  }
                  withIndicator
                  indicatorPulse={service.is_active}
                >
                  {service.is_active ? "Hoạt động" : "Ẩn"}
                </Badge>
              </span>
            </TooltipTrigger>
            <TooltipContent>
              {service.is_active
                ? "Dịch vụ đang hiển thị trên app khách hàng"
                : "Dịch vụ đang ẩn, khách hàng không thể đặt"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      header: "Hành động",
      className: "pr-6 text-right",
      cell: (service) => (
        <div onClick={(e) => e.stopPropagation()}>
          <ServiceActions
            service={service}
            onEdit={() => setEditingService(service)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
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
              <CreateServiceWizard
                availableSkills={availableSkills}
                availableBedTypes={availableBedTypes}
                availableEquipment={availableEquipment}
              />
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

      {editingService && (
        <ServiceSheet
          mode="update"
          initialData={editingService}
          open={!!editingService}
          onOpenChange={(open) => !open && setEditingService(null)}
          availableSkills={availableSkills}
          availableBedTypes={availableBedTypes}
          availableEquipment={availableEquipment}
        />
      )}

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
      filterable={false}
      showAction={false}
      variant="flush"
    />
  );
}
