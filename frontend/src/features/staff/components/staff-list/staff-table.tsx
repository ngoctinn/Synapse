"use client"

import { Skill } from "@/features/services/types"
import { useStaffActions } from "@/features/staff/hooks/use-staff-actions"
import { useTableParams, useTableSelection } from "@/shared/hooks"
import { cn } from "@/shared/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { AnimatedUsersIcon } from "@/shared/ui/custom/animated-icon"
import { Column, DataTable } from "@/shared/ui/custom/data-table"
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state"
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"
import { StatusBadge } from "@/shared/ui/custom/status-badge"
import { TableActionBar } from "@/shared/ui/custom/table-action-bar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip"
import { Calendar } from "lucide-react"
import { useState } from "react"
import { ROLE_CONFIG } from "../../model/constants"
import { Staff } from "../../model/types"
import { InviteStaffTrigger } from "../invite-staff-trigger"
import { StaffSheet } from "../staff-sheet"
import { StaffActions } from "./staff-actions"


interface StaffTableProps {
  data: Staff[]
  skills: Skill[]
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  className?: string
  variant?: "default" | "flush"
  isLoading?: boolean
}

const GroupActionButtons = ({ staff }: { staff: Staff }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10">
                        <Calendar className="h-4 w-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Xem lịch làm việc</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export function StaffTable({
  data,
  skills,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
  variant = "default",
  isLoading
}: StaffTableProps) {
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)

  // Use custom hook for URL state management
  const { page: urlPage, sortBy, order, handlePageChange: urlPageChange, handleSort } = useTableParams({
    defaultSortBy: "created_at",
    defaultOrder: "desc"
  })

  // Support both controlled and uncontrolled modes
  const page = pageProp ?? urlPage
  const handlePageChange = onPageChangeProp ?? urlPageChange

  const selection = useTableSelection({
    data,
    keyExtractor: (item) => item.user_id,
  })

  const {
      isPending,
      showBulkDeleteDialog,
      setShowBulkDeleteDialog,
      handleBulkDelete
  } = useStaffActions()

  const onBulkDelete = () => {
      const ids = Array.from(selection.selectedIds) as string[]
      handleBulkDelete(ids, selection.clearAll)
  }


  const columns: Column<Staff>[] = [
    {
      header: "Nhân viên",
      accessorKey: "user.full_name",
      id: "user.full_name",
      sortable: true,
      cell: (staff) => (

        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={staff.user.avatar_url || undefined} alt={staff.user.full_name || ""} />
            <AvatarFallback
              className="font-medium text-white shadow-sm"
              style={{ backgroundColor: staff.color_code || "hsl(var(--primary))" }}
            >
              {(staff.user.full_name || staff.user.email || "?").charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-lg font-serif text-foreground group-hover:text-primary transition-colors tracking-tight">{staff.user.full_name || "Chưa cập nhật tên"}</span>
            <span className="text-xs text-muted-foreground">{staff.user.email}</span>
          </div>
        </div>
      )
    },
    {
      header: "Vai trò",
      accessorKey: "user.role",
      id: "user.role",
      sortable: true,
      cell: (staff) => (

        <Badge
          variant={ROLE_CONFIG[staff.user.role]?.variant || "outline"}
          className={cn(
            "rounded-md px-2.5 py-1 font-medium border-transparent text-xs",
            ROLE_CONFIG[staff.user.role]?.className || "bg-muted text-muted-foreground"
          )}
        >
          {ROLE_CONFIG[staff.user.role]?.label || staff.user.role}
        </Badge>
      )
    },
    {
      header: "Kỹ năng",
      cell: (staff) => (
        <div className="flex flex-wrap gap-2">
          {staff.skills.length > 0 ? (
            <>
              {staff.skills.slice(0, 2).map((skill) => (
                <Badge key={skill.id} variant="secondary" className="text-xs px-2.5 py-1 bg-secondary/50 hover:bg-secondary/70 text-secondary-foreground border-transparent rounded-md transition-colors">
                  {skill.name}
                </Badge>
              ))}
              {staff.skills.length > 2 && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="text-xs px-2.5 py-1 bg-secondary/50 hover:bg-secondary/70 text-secondary-foreground border-transparent cursor-help rounded-md">
                        +{staff.skills.length - 2} nữa
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="flex flex-col gap-1">
                        {staff.skills.slice(2).map((skill) => (
                          <span key={skill.id}>{skill.name}</span>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </>
          ) : (
            <span className="text-xs text-muted-foreground italic pl-1">--</span>
          )}
        </div>
      )
    },
    {
      header: "Trạng thái",
      cell: (staff) => <StatusBadge isActive={staff.user.is_active} />
    },
    {
      header: "Hành động",
      className: "pr-6 text-right",
      cell: (staff) => (
        <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-end gap-2">
            <GroupActionButtons staff={staff} />
            <StaffActions
                staff={staff}
                skills={skills}
                onEdit={() => setEditingStaff(staff)}
            />
        </div>
      )
    }
  ]

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        keyExtractor={(staff) => staff.user_id}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className={className}
        variant={variant}
        isLoading={isLoading}
        skeletonCount={5}

        selectable
        isSelected={selection.isSelected}
        onToggleOne={selection.toggleOne}
        onToggleAll={selection.toggleAll}
        isAllSelected={selection.isAllSelected}
        isPartiallySelected={selection.isPartiallySelected}

        onRowClick={(staff) => setEditingStaff(staff)}
        sortColumn={sortBy}
        sortDirection={order}
        onSort={handleSort}
        emptyState={
          <DataTableEmptyState
            icon={AnimatedUsersIcon}
            title="Chưa có nhân viên nào"
            description="Danh sách nhân viên hiện đang trống."
            action={<InviteStaffTrigger skills={skills} />}
          />
        }
      />

      <TableActionBar
        selectedCount={selection.selectedCount}
        onDelete={() => setShowBulkDeleteDialog(true)}
        onDeselectAll={selection.clearAll}
        isLoading={isPending}
      />

      <AlertDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xóa {selection.selectedCount} nhân viên?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tất cả nhân viên đã chọn sẽ bị xóa khỏi hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={onBulkDelete}

              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? "Đang xóa..." : `Xóa ${selection.selectedCount} mục`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
  )
}

export function StaffTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={6}
      rowCount={5}
      searchable={false}
      filterable={false}
      showAction={false}
      className="border-none shadow-none rounded-none"
    />
  )
}

