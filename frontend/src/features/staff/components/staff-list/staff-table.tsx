"use client";

import { Skill } from "@/features/services";
import { deleteStaff, updateStaff } from "@/features/staff/actions";
import { Icon } from "@/shared/components";
import { Column, DataTable } from "@/shared/components/data-table";
import { DataTableEmptyState } from "@/shared/components/data-table-empty-state";
import { DataTableSkeleton } from "@/shared/components/data-table-skeleton";
import { DataTableToolbar } from "@/shared/components/data-table-toolbar";
import { DeleteConfirmDialog } from "@/shared/components/delete-confirm-dialog";
import { TableActionBar } from "@/shared/components/table-action-bar";
import {
    useBulkAction,
    useTableParams,
} from "@/shared/hooks";
import { Z_INDEX } from "@/shared/lib/design-tokens";
import { cn, getInitials } from "@/shared/lib/utils";
import { Spinner } from "@/shared/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Group, Stack } from "@/shared/ui/layout";
import { Switch } from "@/shared/ui/switch";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/shared/ui/tooltip";
import { Text as UIText } from "@/shared/ui/typography";
import { Phone, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ROLE_CONFIG } from "../../model/constants";
import { Staff } from "../../model/types";
import { InviteStaffTrigger } from "../invite-staff-trigger";
import { StaffFilter } from "../staff-filter";
import { StaffSheet } from "../staff-sheet";
import { StaffActions } from "./staff-actions";

interface StaffTableProps {
  data: Staff[];
  skills: Skill[];
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
  canManageStaff?: boolean;
}

export function StaffTable({
  data,
  skills,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
  variant = "default",
  isLoading,
  hidePagination,
  searchProps,
  canManageStaff = false,
}: StaffTableProps) {
  const router = useRouter();
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [rowSelection, setRowSelection] = useState({});

  const {
    page: urlPage,
    handlePageChange: urlPageChange,
  } = useTableParams({
    defaultSortBy: "created_at",
    defaultOrder: "desc",
  });

  const page = pageProp ?? urlPage;
  const handlePageChange = onPageChangeProp ?? urlPageChange;

  const {
    execute: executeBulkDelete,
    isPending,
    showDialog: showBulkDeleteDialog,
    setShowDialog: setShowBulkDeleteDialog,
  } = useBulkAction(deleteStaff, {
    successMessage: (count) => `Đã xóa ${count} nhân viên`,
    errorMessage: (count) => `Không thể xóa ${count} nhân viên`,
  });

  const handleBulkDelete = () => {
    const ids = Object.keys(rowSelection);
    executeBulkDelete(ids, () => setRowSelection({}));
  };

  const handleToggleStatus = async (staff: Staff, checked: boolean) => {
    try {
      await updateStaff(staff.user_id, { is_active: checked });
      toast.success(checked ? "Đã kích hoạt nhân viên" : "Đã vô hiệu hóa nhân viên");
      router.refresh();
    } catch (error) {
      toast.error("Không thể thay đổi trạng thái");
    }
  };

  const getRoleBadge = (role: string) => {
    const config = ROLE_CONFIG[role as keyof typeof ROLE_CONFIG];
    return config?.label || role;
  }

  const columns: Column<Staff>[] = [
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
      header: "Nhân viên",
      accessorKey: "user.full_name",
      id: "user.full_name",
      enableSorting: true,
      cell: ({ row }) => (
        <Group align="center" gap={4}>
          <Avatar className="h-10 w-10 border">
            <AvatarImage
              src={row.original.user.avatar_url || undefined}
              alt={row.original.user.full_name || ""}
            />
            <AvatarFallback
              className="font-medium text-white shadow-sm"
              style={{
                backgroundColor: row.original.color_code || "hsl(var(--primary))",
              }}
            >
              {getInitials(row.original.user.full_name || row.original.user.email || "?")}
            </AvatarFallback>
          </Avatar>
          <Stack gap={0}>
            <UIText size="sm" weight="medium" className="group-hover:text-primary transition-colors">
              {row.original.user.full_name || "Chưa cập nhật tên"}
            </UIText>
            <UIText size="xs" variant="muted">
              {row.original.user.email}
            </UIText>
          </Stack>
        </Group>
      ),
    },
    {
      header: "Vai trò & Chức vụ",
      id: "user.role",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Badge variant={ROLE_CONFIG[row.original.user.role as keyof typeof ROLE_CONFIG]?.variant || "outline"} className="w-fit">
              {getRoleBadge(row.original.user.role)}
            </Badge>
          </div>
          {row.original.title && (
             <span className="text-xs text-muted-foreground">{row.original.title}</span>
          )}
        </div>
      ),
    },
    {
      header: "Kỹ năng",
      cell: ({ row }) => {
        const skills = row.original.skills || [];
        if (skills.length === 0) return <span className="text-xs text-muted-foreground italic">Chưa có kỹ năng</span>;

        return (
          <Group wrap gap={2}>
            {skills.slice(0, 2).map((skill) => (
              <Badge key={skill.id} variant="violet" size="sm">
                {skill.name}
              </Badge>
            ))}
            {skills.length > 2 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="violet" size="sm">
                        +{skills.length - 2} nữa
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <Stack gap={1}>
                        {skills.slice(2).map((skill) => (
                          <span key={skill.id}>{skill.name}</span>
                        ))}
                      </Stack>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
            )}
          </Group>
        );
      },
    },
    {
      header: "Liên hệ",
      meta: { align: "right" },
      cell: ({ row }) => (
        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          {row.original.user.phone_number && (
            <div className="flex items-center gap-1 justify-end">
              <Icon icon={Phone} className="h-3 w-3" />
              <span>{row.original.user.phone_number}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Trạng thái",
      id: "user.is_active",
      meta: { align: "center" },
      cell: ({ row }) => (
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
           <Switch
              checked={row.original.user.is_active}
              onCheckedChange={(checked) => handleToggleStatus(row.original, checked)}
           />
           <Badge variant={row.original.user.is_active ? "status-active" : "status-inactive"}>
             {row.original.user.is_active ? "Đang làm việc" : "Đã nghỉ"}
           </Badge>
        </div>
      ),
    },
    {
      header: "Hành động",
      id: "actions",
      meta: { align: "right" },
      cell: ({ row }) => (
        <div className="text-right" onClick={(e) => e.stopPropagation()}>
          <StaffActions
            staff={row.original}
            onEdit={() => setEditingStaff(row.original)}
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
        variant={variant}
        isLoading={isLoading}
        skeletonCount={5}
        hidePagination={hidePagination}
        toolbar={
          <DataTableToolbar
            searchField={
              searchProps && (
                  <Input
                    placeholder="Tìm kiếm nhân viên..."
                    defaultValue={searchProps.initialValue}
                    onChange={(e) => searchProps.onSearch(e.target.value)}
                    startContent={<Search className="text-muted-foreground" size={16} />}
                    className="w-full"
                  />
              )
            }
            filters={<StaffFilter />}
            actions={canManageStaff && <InviteStaffTrigger skills={skills} />}
          />
        }
        rowSelection={rowSelection}
        onRowSelectionChange={setRowSelection as any}
        getRowId={(row) => row.user_id}
        onRowClick={(staff) => setEditingStaff(staff)}
        emptyState={
          <DataTableEmptyState
            icon={Users}
            title="Chưa có nhân viên"
            description="Thêm nhân viên mới để quản lý lịch làm việc và dịch vụ."
            action={<InviteStaffTrigger skills={skills} />}
          />
        }
      />
      {isPending && (
        <Stack align="center" justify="center" className={cn(Z_INDEX.loadingOverlay, "bg-background/50 absolute inset-0 backdrop-blur-[2px]")}>
          <Spinner className="text-primary mb-2 h-8 w-8" />
          <p className="text-muted-foreground animate-pulse text-sm font-medium">
            Đang xử lý...
          </p>
        </Stack>
      )}

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
        entityName={`${Object.keys(rowSelection).length} nhân viên`}
      />

      {editingStaff && (
        <StaffSheet
          mode="update"
          staff={editingStaff}
          skills={skills}
          open={!!editingStaff}
          onOpenChange={(open) => !open && setEditingStaff(null)}
        />
      )}
    </>
  );
}

export function StaffTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={6}
      rowCount={5}
      searchable={false}
      filterable={true}
      showAction={false}
      variant="flush"
    />
  );
}
