"use client"

import { cn, formatCurrency } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { AnimatedTableRow } from "@/shared/ui/custom/animated-table-row"
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state"
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"
import { PaginationControls } from "@/shared/ui/custom/pagination-controls"
import { StatusBadge } from "@/shared/ui/custom/status-badge"
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
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
  className?: string
  variant?: "default" | "flush"
}

export function ServiceTable({
  services,
  availableSkills,
  page = 1,
  totalPages = 1,
  onPageChange,
  className,
  variant = "default"
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

  const containerClasses = cn(
    "relative bg-background",
    variant === "default" && "border rounded-xl shadow-sm",
    className
  )

  return (
    <div className="flex flex-col gap-4">
      <div className={containerClasses}>
        <table className="w-full caption-bottom text-sm min-w-[800px]">
          <TableHeader className="sticky top-[var(--header-height,57px)] z-20 bg-background shadow-sm after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="bg-transparent pl-8 h-14 font-medium text-muted-foreground">Tên dịch vụ</TableHead>
              <TableHead className="bg-transparent h-14 font-medium text-muted-foreground">Thời lượng</TableHead>
              <TableHead className="bg-transparent h-14 font-medium text-muted-foreground">Giá</TableHead>
              <TableHead className="bg-transparent h-14 font-medium text-muted-foreground">Kỹ năng yêu cầu</TableHead>
              <TableHead className="bg-transparent h-14 font-medium text-muted-foreground">Trạng thái</TableHead>
              <TableHead className="text-right bg-transparent pr-8 h-14 font-medium text-muted-foreground">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service, index) => (
              <AnimatedTableRow key={service.id} index={index} className="group hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0">
                <TableCell className="font-medium pl-8 py-5">
                  <div className="flex items-center gap-3">
                    {service.color && (
                      <div
                        className="w-3 h-3 rounded-full shadow-sm ring-1 ring-border/20 flex-shrink-0"
                        style={{ backgroundColor: service.color }}
                      />
                    )}
                    <div className="flex flex-col">
                      <span className="text-lg font-serif text-foreground group-hover:text-primary transition-colors tracking-tight">{service.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-5">
                  <div className="flex flex-col text-xs gap-1.5">
                    <span className="font-medium flex items-center gap-2 text-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                      Phục vụ: {service.duration}p
                    </span>
                    <span className="text-muted-foreground flex items-center gap-2 pl-3.5">
                      Nghỉ: {service.buffer_time}p
                    </span>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground py-5 text-base">
                  {formatCurrency(service.price)}
                </TableCell>
                <TableCell className="py-5">
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
                </TableCell>
                <TableCell className="py-5">
                  <StatusBadge isActive={service.is_active} />
                </TableCell>
                <TableCell className="text-right pr-8 py-5">
                  <ServiceActions service={service} availableSkills={availableSkills} />
                </TableCell>
              </AnimatedTableRow>
            ))}
          </TableBody>
        </table>
      </div>
      <div className="px-1">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}

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
