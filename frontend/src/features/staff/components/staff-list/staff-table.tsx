"use client"

import { Skill } from "@/features/services/types"
import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { AnimatedTableRow } from "@/shared/ui/custom/animated-table-row"
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state"
import { PaginationControls } from "@/shared/ui/custom/pagination-controls"
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

const roleConfig = ROLE_CONFIG

interface StaffTableProps {
  data: Staff[]
  skills: Skill[]
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export function StaffTable({
  data,
  skills,
  page = 1,
  totalPages = 1,
  onPageChange
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

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 overflow-auto bg-white border relative">
        <table className="w-full caption-bottom text-sm min-w-[800px]">
          <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="pl-6 bg-white">Nhân viên</TableHead>
              <TableHead className="bg-white">Vai trò</TableHead>
              <TableHead className="bg-white">Kỹ năng</TableHead>
              <TableHead className="bg-white">Trạng thái</TableHead>
              <TableHead className="text-right pr-6 bg-white">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((staff, index) => (
              <AnimatedTableRow key={staff.user_id} index={index}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={staff.user.avatar_url || undefined} alt={staff.user.full_name || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {(staff.user.full_name || staff.user.email || "?").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{staff.user.full_name || "Chưa cập nhật tên"}</span>
                      <span className="text-xs text-muted-foreground">{staff.user.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={roleConfig[staff.user.role]?.variant || "outline"}
                    className={cn(
                      "rounded-md px-2.5 py-0.5 font-medium",
                      roleConfig[staff.user.role]?.className || "bg-gray-100 text-gray-600"
                    )}
                  >
                    {roleConfig[staff.user.role]?.label || staff.user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {staff.skills.length > 0 ? (
                      <>
                        {staff.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill.id} variant="outline" className="text-xs font-normal">
                            {skill.name}
                          </Badge>
                        ))}
                        {staff.skills.length > 2 && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="text-xs font-normal cursor-help">
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
                      <span className="text-xs text-muted-foreground italic">--</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={staff.user.is_active ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 hover:bg-emerald-500/20" : "bg-slate-500/10 text-slate-600 border-slate-500/20 hover:bg-slate-500/20"}>
                    {staff.user.is_active ? (
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
                  <StaffActions staff={staff} skills={skills} />
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
