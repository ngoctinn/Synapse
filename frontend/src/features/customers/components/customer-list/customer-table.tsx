"use client"

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
import { AnimatedUsersIcon } from "@/shared/ui/custom/animated-icon"
import { Column, DataTable } from "@/shared/ui/custom/data-table"
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state"
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"
import { showToast } from "@/shared/ui/custom/sonner"
import { TableActionBar } from "@/shared/ui/custom/table-action-bar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip"
import { Activity, AlertCircle } from "lucide-react"
import { useState, useTransition } from "react"
import { Customer } from "../../model/types"
import { CreateCustomerTrigger } from "../create-customer-trigger"
import { CustomerActions } from "../customer-actions"
import { CustomerSheet } from "../customer-sheet"

interface CustomerTableProps {
  data: Customer[]
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  className?: string
  isLoading?: boolean
  variant?: "default" | "flush"
}

const TIER_STYLES: Record<string, string> = {
    SILVER: "bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-200",
    GOLD: "bg-gradient-to-r from-amber-100 to-amber-200 text-amber-700 border-amber-200",
    PLATINUM: "bg-gradient-to-r from-slate-700 to-slate-900 text-white border-slate-700",
}

export function CustomerTable({
  data,
  page: pageProp,
  totalPages = 1,
  onPageChange: onPageChangeProp,
  className,
  isLoading,
  variant = "default"
}: CustomerTableProps) {
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [isPending, startTransition] = useTransition()

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
    keyExtractor: (item) => item.id,
  })

  const handleBulkDelete = async () => {
      // Mock implementation
      showToast.success("Đã xóa (Mock)", "Chức năng đang phát triển")
      setShowBulkDeleteDialog(false)
      selection.clearAll()
  }

  const columns: Column<Customer>[] = [
    {
      header: "Khách hàng",
      accessorKey: "full_name",
      sortable: true,
      cell: (customer) => (
        <div className="flex items-center gap-4">
          <Avatar className="h-11 w-11 border">
            <AvatarImage src={customer.avatar_url || undefined} alt={customer.full_name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {(customer.full_name).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{customer.full_name}</span>
            <span className="text-xs text-muted-foreground">{customer.email || "Chưa có email"}</span>
          </div>
        </div>
      )
    },
    {
        header: "Số điện thoại",
        accessorKey: "phone_number",
        cell: (c) => <div className="text-sm font-mono">{c.phone_number || "--"}</div>
    },
    {
        header: "Hạng thành viên",
        accessorKey: "membership_tier",
        cell: (c) => (
            <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider", TIER_STYLES[c.membership_tier])}>
                {c.membership_tier}
            </Badge>
        )
    },
    {
        header: "Điểm",
        accessorKey: "loyalty_points",
        sortable: true,
        cell: (c) => (
            <div className="font-medium text-sm flex items-center gap-1">
                {c.loyalty_points.toLocaleString('vi-VN')} <span className="text-xs text-muted-foreground font-normal">pts</span>
            </div>
        )
    },
    {
        header: "Y tế",
        cell: (c) => (
            <div className="flex gap-1">
                {c.allergies && (
                     <TooltipProvider>
                     <Tooltip>
                         <TooltipTrigger>
                            <AlertCircle className="h-4 w-4 text-red-500" />
                         </TooltipTrigger>
                         <TooltipContent>
                             <p className="font-semibold text-red-500">Dị ứng:</p>
                             <p>{c.allergies}</p>
                         </TooltipContent>
                     </Tooltip>
                 </TooltipProvider>
                )}
                {c.medical_notes && (
                     <TooltipProvider>
                     <Tooltip>
                         <TooltipTrigger>
                            <Activity className="h-4 w-4 text-blue-500" />
                         </TooltipTrigger>
                         <TooltipContent>
                             <p className="font-semibold text-blue-500">Ghi chú y tế:</p>
                             <p>{c.medical_notes}</p>
                         </TooltipContent>
                     </Tooltip>
                 </TooltipProvider>
                )}
            </div>
        )
    },
    {
      header: "Hành động",
      className: "pr-6 text-right",
      cell: (customer) => (
        <div onClick={(e) => e.stopPropagation()} className="flex items-center justify-end">
            <CustomerActions customer={customer} onEdit={() => setEditingCustomer(customer)} />
        </div>
      )
    }
  ]

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

        selectable
        isSelected={selection.isSelected}
        onToggleOne={selection.toggleOne}
        onToggleAll={selection.toggleAll}
        isAllSelected={selection.isAllSelected}
        isPartiallySelected={selection.isPartiallySelected}

        onRowClick={(c) => setEditingCustomer(c)}
        sortColumn={sortBy}
        sortDirection={order}
        onSort={handleSort}
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

       <AlertDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa {selection.selectedCount} khách hàng?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive hover:bg-destructive/90">Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {editingCustomer && (
        <CustomerSheet
          mode="update"
          customer={editingCustomer}
          open={!!editingCustomer}
          onOpenChange={(open: boolean) => !open && setEditingCustomer(null)}
        />
      )}
    </>
  )
}

export function CustomerTableSkeleton() {
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
