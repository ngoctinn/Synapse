"use client"

import { cn, formatCurrency } from "@/shared/lib/utils"
import { Badge } from "@/shared/ui/badge"
import { AnimatedTableRow } from "@/shared/ui/custom/animated-table-row"
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state"
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"
import { PaginationControls } from "@/shared/ui/custom/pagination-controls"
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
}

export function ServiceTable({
  services,
  availableSkills,
  page = 1,
  totalPages = 1,
  onPageChange,
  className
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
    <div className="flex flex-col gap-4">
      <div className={cn("bg-background border rounded-xl relative shadow-sm", className)}>
        <table className="w-full caption-bottom text-sm min-w-[800px]">
          <TableHeader className="sticky top-[89px] z-20 bg-background shadow-sm after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border/50">
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
                  <div className="flex flex-col">
                    <span className="text-lg font-serif text-foreground group-hover:text-primary transition-colors tracking-tight">{service.name}</span>
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
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
                    service.is_active
                      ? "bg-primary/5 text-primary border-primary/20 shadow-[0_0_10px_rgba(var(--primary),0.1)]"
                      : "bg-muted/50 text-muted-foreground border-border/50"
                  }`}>
                    {service.is_active ? (
                        <span className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-20 animate-pulse"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]"></span>
                            </span>
                            Hoạt động
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-muted-foreground/40"></span>
                            Ẩn
                        </span>
                    )}
                  </div>
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
