"use client"

import { Resource, RoomType } from "@/features/resources"
import { useTableSelection } from "@/shared/hooks/use-table-selection"
import { formatCurrency } from "@/shared/lib/utils"
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
import { Badge } from "@/shared/ui/badge"
import { Column, DataTable } from "@/shared/ui/custom/data-table"
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state"
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"
import { StatusBadge } from "@/shared/ui/custom/status-badge"
import { TableActionBar } from "@/shared/ui/custom/table-action-bar"
import { Plus } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { deleteService } from "../actions"
import { Service, Skill } from "../types"
import { CreateServiceDialog } from "./create-service-dialog"
import { ServiceActions } from "./service-actions"

interface ServiceTableProps {
  services: Service[]
  availableSkills: Skill[]
  availableRoomTypes: RoomType[]
  availableEquipment: Resource[]
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  className?: string
  variant?: "default" | "flush"
  isLoading?: boolean
}

export function ServiceTable({
  services,
  availableSkills,
  availableRoomTypes,
  availableEquipment,
  page = 1,
  totalPages = 1,
  onPageChange,
  className,
  variant = "default",
  isLoading
}: ServiceTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false)
  const [isPending, startTransition] = useTransition()


  const selection = useTableSelection({
    data: services,
    keyExtractor: (item) => item.id,
  })

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage)
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }


  const handleBulkDelete = async () => {
    const ids = Array.from(selection.selectedIds) as string[]
    if (ids.length === 0) return

    startTransition(async () => {
      try {
        let successCount = 0
        for (const id of ids) {
          try {
            const result = await deleteService(id)
            if (result.success) successCount++
          } catch (e) {
            console.error(`Failed to delete ${id}:`, e)
          }
        }

        if (successCount > 0) {
          toast.success(`Đã xóa ${successCount} dịch vụ`)
          selection.clearAll()
          router.refresh()
        }
        if (successCount < ids.length) {
          toast.error(`Không thể xóa ${ids.length - successCount} dịch vụ`)
        }
      } catch (error) {
        console.error(error)
        toast.error("Không thể xóa dịch vụ")
      } finally {
        setShowBulkDeleteDialog(false)
      }
    })
  }

  const columns: Column<Service>[] = [
    {
      header: "Tên dịch vụ",
      cell: (service) => (
        <div className="flex flex-col">
          <span className="text-lg font-serif text-foreground group-hover:text-primary transition-colors tracking-tight">{service.name}</span>
        </div>
      )
    },
    {
      header: "Thời lượng",
      cell: (service) => (
        <div className="flex flex-col text-xs gap-1.5">
          <span className="font-medium flex items-center gap-2 text-foreground/80">
            <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
            Phục vụ: {service.duration}p
          </span>
          <span className="text-muted-foreground flex items-center gap-2 pl-3.5">
            Nghỉ: {service.buffer_time}p
          </span>
        </div>
      )
    },
    {
      header: "Giá",
      className: "font-medium text-foreground text-base",
      cell: (service) => formatCurrency(service.price)
    },
    {
      header: "Kỹ năng yêu cầu",
      cell: (service) => (
        <div className="flex flex-wrap gap-2">
          {service.skills.map((skill) => (
            <Badge key={skill.id} variant="secondary" className="text-[11px] px-2.5 py-1 bg-secondary/40 hover:bg-secondary/60 text-secondary-foreground border-transparent rounded-md transition-colors">
              {skill.name}
            </Badge>
          ))}
          {service.skills.length === 0 && (
            <span className="text-xs text-muted-foreground italic pl-1">Không yêu cầu</span>
          )}
        </div>
      )
    },
    {
      header: "Trạng thái",
      cell: (service) => <StatusBadge isActive={service.is_active} />
    },
    {
      header: "Thao tác",
      cell: (service) => (
        <ServiceActions
          service={service}
          availableSkills={availableSkills}
          availableRoomTypes={availableRoomTypes}
          availableEquipment={availableEquipment}
        />
      )
    }
  ]

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

        selectable
        isSelected={selection.isSelected}
        onToggleOne={selection.toggleOne}
        onToggleAll={selection.toggleAll}
        isAllSelected={selection.isAllSelected}
        isPartiallySelected={selection.isPartiallySelected}
        emptyState={
          <DataTableEmptyState
            icon={Plus}
            title="Chưa có dịch vụ nào"
            description="Bắt đầu bằng cách tạo dịch vụ đầu tiên của bạn. Dịch vụ sẽ hiển thị trên trang đặt lịch."
            action={
              <CreateServiceDialog
                availableSkills={availableSkills}
                availableRoomTypes={availableRoomTypes}
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

      <AlertDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xóa {selection.selectedCount} dịch vụ?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tất cả dịch vụ đã chọn sẽ bị xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
            >
              {isPending ? "Đang xóa..." : `Xóa ${selection.selectedCount} mục`}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export function ServiceTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={7}
      rowCount={5}
      searchable={false}
      filterable={false}
      showAction={false}
      className="border-none shadow-none rounded-none"
    />
  )
}
