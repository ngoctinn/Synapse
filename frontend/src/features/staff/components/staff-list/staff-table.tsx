"use client"

import { Skill } from "@/features/services/types"
import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { AnimatedTableRow } from "@/shared/ui/custom/animated-table-row"
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state"
import { PaginationControls } from "@/shared/ui/custom/pagination-controls"
import { StatusBadge } from "@/shared/ui/custom/status-badge"
import {
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/shared/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/shared/ui/tooltip"
import { Users } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ROLE_CONFIG } from "../../constants"
import { Staff } from "../../types"
import { StaffActions } from "./staff-actions"

interface StaffTableProps {
  data: Staff[]
  skills: Skill[]
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
  className?: string
  variant?: "default" | "flush"
}

export function StaffTable({
  data,
  skills,
  page = 1,
  totalPages = 1,
  onPageChange,
  className,
  variant = "default"
}: StaffTableProps) {
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

  if (data.length === 0) {
    return (
      <DataTableEmptyState
        icon={Users}
        title="Chưa có nhân viên nào"
        description="Danh sách nhân viên hiện đang trống."
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
          <TableHeader className="sticky top-[var(--staff-header-height-mobile,109px)] md:top-[var(--staff-header-height,57px)] z-20 bg-background shadow-sm after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-border/50">
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="bg-transparent pl-8 h-14 font-medium text-muted-foreground">Nhân viên</TableHead>
              <TableHead className="bg-transparent h-14 font-medium text-muted-foreground">Vai trò</TableHead>
              <TableHead className="bg-transparent h-14 font-medium text-muted-foreground">Kỹ năng</TableHead>
              <TableHead className="bg-transparent h-14 font-medium text-muted-foreground">Trạng thái</TableHead>
              <TableHead className="text-right bg-transparent pr-8 h-14 font-medium text-muted-foreground">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((staff, index) => (
              <AnimatedTableRow key={staff.user_id} index={index} className="group hover:bg-muted/30 transition-colors border-b border-border/40 last:border-0">
                <TableCell className="pl-8 py-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={staff.user.avatar_url || undefined} alt={staff.user.full_name || ""} />
                      <AvatarFallback className="bg-primary/20 text-primary font-medium">
                        {(staff.user.full_name || staff.user.email || "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-lg font-serif text-foreground group-hover:text-primary transition-colors tracking-tight">{staff.user.full_name || "Chưa cập nhật tên"}</span>
                      <span className="text-xs text-muted-foreground">{staff.user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-5">
                  <Badge
                    variant={ROLE_CONFIG[staff.user.role]?.variant || "outline"}
                    className={cn(
                      "rounded-md px-2.5 py-1 font-medium border-transparent text-[11px]",
                      ROLE_CONFIG[staff.user.role]?.className || "bg-gray-100 text-gray-600"
                    )}
                  >
                    {ROLE_CONFIG[staff.user.role]?.label || staff.user.role}
                  </Badge>
                </TableCell>
                <TableCell className="py-5">
                  <div className="flex flex-wrap gap-2">
                    {staff.skills.length > 0 ? (
                      <>
                        {staff.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill.id} variant="secondary" className="text-[11px] px-2.5 py-1 bg-secondary/40 hover:bg-secondary/60 text-secondary-foreground border-transparent rounded-md transition-colors">
                            {skill.name}
                          </Badge>
                        ))}
                        {staff.skills.length > 2 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="secondary" className="text-[11px] px-2.5 py-1 bg-secondary/40 hover:bg-secondary/60 text-secondary-foreground border-transparent cursor-help rounded-md">
                                  +{staff.skills.length - 2} more
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
                </TableCell>
                <TableCell className="py-5">
                  <StatusBadge isActive={staff.user.is_active} />
                </TableCell>
                <TableCell className="text-right pr-6 py-4">
                  <StaffActions staff={staff} skills={skills} />
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

import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"

export function StaffTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={5}
      rowCount={5}
      searchable={true}
      filterable={true}
    />
  )
}
