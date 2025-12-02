"use client"

import { formatCurrency } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { AnimatedTableRow } from "@/shared/ui/custom/animated-table-row"
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state"
import { PaginationControls } from "@/shared/ui/custom/pagination-controls"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import { Plus } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Service, Skill } from "../types"
import { CreateServiceDialog } from "./create-service-dialog"
import { ServiceActions } from "./service-actions"

interface ServiceTableProps {
  services: Service[]
  availableSkills: Skill[]
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export function ServiceTable({
  services,
  availableSkills,
  page = 1,
  totalPages = 1,
  onPageChange
}: ServiceTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage)
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  if (services.length === 0) {
    return (
      <DataTableEmptyState
        icon={Plus}
        title="Chưa có dịch vụ nào"
        description="Bắt đầu bằng cách tạo dịch vụ đầu tiên của bạn. Dịch vụ sẽ hiển thị trên trang đặt lịch."
        action={<CreateServiceDialog availableSkills={availableSkills} />}
      />
    )
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 overflow-auto bg-white border relative">
        <table className="w-full caption-bottom text-sm min-w-[800px]">
          <TableHeader className="sticky top-0 z-20 bg-white shadow-sm">
            <TableRow>
              <TableHead className="bg-white pl-6">Tên dịch vụ</TableHead>
              <TableHead className="bg-white">Thời lượng</TableHead>
              <TableHead className="bg-white">Giá</TableHead>
              <TableHead className="bg-white">Kỹ năng yêu cầu</TableHead>
              <TableHead className="bg-white">Trạng thái</TableHead>
              <TableHead className="text-right bg-white pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service, index) => (
              <AnimatedTableRow key={service.id} index={index}>
                <TableCell className="font-medium pl-6">
                  <div className="flex flex-col">
                    <span>{service.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                    <span className="font-medium">Phục vụ: {service.duration}p</span>
                    <span className="text-muted-foreground">Nghỉ: {service.buffer_time}p</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  {formatCurrency(service.price)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {service.skills.map((skill) => (
                      <Badge key={skill.id} variant="secondary" className="text-[10px] px-1.5 py-0">
                        {skill.name}
                      </Badge>
                    ))}
                    {service.skills.length === 0 && (
                      <span className="text-xs text-muted-foreground italic">Không yêu cầu</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={service.is_active ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20" : "bg-slate-500/10 text-slate-600 border-slate-500/20 hover:bg-slate-500/20"}>
                    {service.is_active ? (
                        <span className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Hoạt động
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-slate-400"></span>
                            Ẩn
                        </span>
                    )}
                  </Badge>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <ServiceActions service={service} availableSkills={availableSkills} />
                </TableCell>
              </AnimatedTableRow>
            ))}
          </TableBody>
        </table>
      </div>
      <div className="px-4 pb-4">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"

export function ServiceTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={6}
      rowCount={5}
      searchable={true}
      filterable={false}
    />
  )
}
