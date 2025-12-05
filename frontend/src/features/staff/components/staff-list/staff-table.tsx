"use client"

import { Skill } from "@/features/services/types"
import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { Column, DataTable } from "@/shared/ui/custom/data-table"
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state"
import { DataTableSkeleton } from "@/shared/ui/custom/data-table-skeleton"
import { StatusBadge } from "@/shared/ui/custom/status-badge"
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
  isLoading?: boolean
}

export function StaffTable({
  data,
  skills,
  page = 1,
  totalPages = 1,
  onPageChange,
  className,
  variant = "default",
  isLoading
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

  const columns: Column<Staff>[] = [
    {
      header: "Nhân viên",
      cell: (staff) => (
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
      )
    },
    {
      header: "Vai trò",
      cell: (staff) => (
        <Badge
          variant={ROLE_CONFIG[staff.user.role]?.variant || "outline"}
          className={cn(
            "rounded-md px-2.5 py-1 font-medium border-transparent text-[11px]",
            ROLE_CONFIG[staff.user.role]?.className || "bg-gray-100 text-gray-600"
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
      )
    },
    {
      header: "Trạng thái",
      cell: (staff) => <StatusBadge isActive={staff.user.is_active} />
    },
    {
      header: "Hành động",
      className: "pr-6",
      cell: (staff) => <StaffActions staff={staff} skills={skills} />
    }
  ]

  return (
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
      emptyState={
        <DataTableEmptyState
          icon={Users}
          title="Chưa có nhân viên nào"
          description="Danh sách nhân viên hiện đang trống."
        />
      }
    />
  )
}

export function StaffTableSkeleton() {
  return (
    <DataTableSkeleton
      columnCount={5}
      rowCount={5}
      searchable={false}
      filterable={false}
      showAction={false}
      className="border-none shadow-none rounded-none"
    />
  )
}
