"use client"

import { CustomerSheet } from "@/features/customers/components/customer-sheet"
import { useTableSelection } from "@/shared/hooks/use-table-selection"
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
import { Column, DataTable } from "@/shared/ui/custom/data-table"
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state"
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"
import { showToast } from "@/shared/ui/custom/sonner"
import { TableActionBar } from "@/shared/ui/custom/table-action-bar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip"
import { Activity, AlertCircle, Edit, MoreHorizontal, Trash2, Users } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { deleteCustomer } from "../../actions"
import { Customer } from "../../types"

interface CustomerTableProps {
  data: Customer[]
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  className?: string
  variant?: "default" | "flush"
  isLoading?: boolean
}

const TIER_STYLES: Record<string, string> = {
    SILVER: "bg-gray-100 text-gray-700 border-gray-200",
    GOLD: "bg-yellow-100 text-yellow-700 border-yellow-200",
    PLATINUM: "bg-slate-800 text-white border-slate-700",
}

export function CustomerTable({
  data,
  page = 1,
  totalPages = 1,
  onPageChange,
  className,
  isLoading
}: CustomerTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [isPending, startTransition] = useTransition()

  const sortColumn = searchParams.get("sort_by") || "created_at"
  const sortDirection = (searchParams.get("order") as "asc" | "desc") || "desc"

  const selection = useTableSelection({
    data,
    keyExtractor: (item) => item.user_id,
  })

  // ... (Identical pagination/sorting logic to StaffTable)
  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage)
      return
    }
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSort = (column: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (sortColumn === column) {
      params.set("order", sortDirection === "asc" ? "desc" : "asc")
    } else {
      params.set("sort_by", column)
      params.set("order", "asc")
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleBulkDelete = async () => {
      // Mock implementation
      showToast.success("Đã xóa (Mock)", "Chức năng đang phát triển")
      setShowBulkDeleteDialog(false)
      selection.clearAll()
  }

  const columns: Column<Customer>[] = [
    {
      header: "Khách hàng",
      accessorKey: "user.full_name" as any,
      sortable: true,
      cell: (customer) => (
        <div className="flex items-center gap-4">
          <Avatar className="h-11 w-11 border">
            <AvatarImage src={customer.user.avatar_url || undefined} alt={customer.user.full_name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {(customer.user.full_name).charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{customer.user.full_name}</span>
            <span className="text-xs text-muted-foreground">{customer.user.email}</span>
          </div>
        </div>
      )
    },
    {
        header: "Số điện thoại",
        accessorKey: "user.phone_number" as any,
        cell: (c) => <div className="text-sm font-mono">{c.user.phone_number || "--"}</div>
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
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Tác vụ</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.user_id)}>
                        Sao chép ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setEditingCustomer(customer)}>
                        <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => startTransition(async () => { await deleteCustomer(customer.user_id) })}>
                        <Trash2 className="mr-2 h-4 w-4" /> Xóa
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      )
    }
  ]

  return (
    <>
      <DataTable
        data={data}
        columns={columns}
        keyExtractor={(item) => item.user_id}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className={className}
        isLoading={isLoading}
        skeletonCount={5}

        selectable
        isSelected={selection.isSelected}
        onToggleOne={selection.toggleOne}
        onToggleAll={selection.toggleAll}
        isAllSelected={selection.isAllSelected}
        isPartiallySelected={selection.isPartiallySelected}

        onRowClick={(c) => setEditingCustomer(c)}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={handleSort}
        emptyState={
          <DataTableEmptyState
            icon={Users}
            title="Chưa có khách hàng"
            description="Danh sách khách hàng hiện đang trống."
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
