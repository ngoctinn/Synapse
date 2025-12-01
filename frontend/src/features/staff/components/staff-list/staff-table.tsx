"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Badge } from "@/shared/ui/badge"
import { AnimatedTableRow } from "@/shared/ui/custom/animated-table-row"
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state"
import { PaginationControls } from "@/shared/ui/custom/pagination-controls"
import { Skeleton } from "@/shared/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip"
import { Users } from "lucide-react"
import { ROLE_CONFIG } from "../../constants"
import { Staff } from "../../types"
import { StaffActions } from "./staff-actions"

const roleConfig = ROLE_CONFIG

interface StaffTableProps {
  data: Staff[]
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export function StaffTable({
  data,
  page = 1,
  totalPages = 1,
  onPageChange = () => {}
}: StaffTableProps) {
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
      <div className="flex-1 overflow-auto bg-white">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-white/95 backdrop-blur shadow-sm">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="w-[250px] pl-6 bg-white/0">Nhân viên</TableHead>
              <TableHead className="bg-white/0">Vai trò</TableHead>
              <TableHead className="bg-white/0">Kỹ năng</TableHead>
              <TableHead className="bg-white/0">Trạng thái</TableHead>
              <TableHead className="text-right pr-6 bg-white/0">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((staff, index) => (
              <AnimatedTableRow key={staff.id} index={index}>
                <TableCell className="pl-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage src={staff.avatarUrl} alt={staff.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">{staff.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{staff.name}</span>
                      <span className="text-xs text-muted-foreground">{staff.email}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={roleConfig[staff.role].variant} className="rounded-md px-2.5 py-0.5 font-medium">
                    {roleConfig[staff.role].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {staff.skills.length > 0 ? (
                      <>
                        {staff.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs font-normal">
                            {skill}
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
                                    <span key={skill}>{skill}</span>
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
                  <Badge variant="outline" className={staff.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"}>
                    {staff.isActive ? (
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
                  <StaffActions staff={staff} />
                </TableCell>
              </AnimatedTableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="px-4 pb-4">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  )
}

export function StaffTableSkeleton() {
  return (
    <div className="rounded-md border bg-white shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
          </div>
          <Skeleton className="h-9 w-32" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
