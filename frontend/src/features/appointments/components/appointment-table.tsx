"use client"

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
import { Calendar, MoreHorizontal, Phone, MessageSquare, Eye } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/shared/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import Link from "next/link"
import { Appointment } from "../types"
import { AppointmentStatusBadge } from "./appointment-status-badge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/shared/ui/tooltip"

interface AppointmentTableProps {
  appointments: Appointment[]
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export function AppointmentTable({
  appointments,
  page = 1,
  totalPages = 1,
  onPageChange
}: AppointmentTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Xử lý thay đổi trang
  // Nếu có onPageChange (client-side pagination) thì gọi nó
  // Ngược lại update URL params (server-side pagination)
  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage)
      return
    }

    const params = new URLSearchParams(searchParams.toString())
    params.set("page", newPage.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  // Hiển thị trạng thái trống nếu không có dữ liệu
  if (appointments.length === 0) {
    return (
      <DataTableEmptyState
        icon={Calendar}
        title="Chưa có lịch hẹn nào"
        description="Danh sách lịch hẹn hiện đang trống."
      />
    )
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 overflow-auto bg-white border relative rounded-md">
        {/* Sử dụng component Table chuẩn từ shadcn/ui thay vì thẻ table HTML thuần */}
        <Table className="min-w-[800px]">
          <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="pl-6 bg-white w-[250px]">Khách hàng</TableHead>
              <TableHead className="bg-white">Dịch vụ</TableHead>
              <TableHead className="bg-white">Thời gian</TableHead>
              <TableHead className="bg-white">Nhân viên</TableHead>
              <TableHead className="bg-white">Trạng thái</TableHead>
              <TableHead className="text-right pr-6 bg-white w-[120px]">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {appointments.map((apt, index) => (
              <AnimatedTableRow key={apt.id} index={index} className="group">
                <TableCell className="pl-6 font-medium">
                  <div className="flex flex-col">
                    <span>{apt.customerName}</span>
                    {/* Quick Actions hiện ra khi hover vào dòng */}
                    <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-blue-50 hover:scale-110 transition-all duration-200">
                                        <Phone className="h-3 w-3" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Gọi điện</TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary hover:bg-blue-50 hover:scale-110 transition-all duration-200">
                                        <MessageSquare className="h-3 w-3" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Nhắn tin</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{apt.serviceName}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {format(apt.startTime, "HH:mm")} - {format(apt.endTime, "HH:mm")}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(apt.startTime, "dd/MM/yyyy", { locale: vi })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{apt.staffName}</TableCell>
                <TableCell>
                  <AppointmentStatusBadge status={apt.status} />
                </TableCell>
                <TableCell className="text-right pr-6">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`?action=view&id=${apt.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Xem chi tiết
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`?action=edit&id=${apt.id}`}>
                          Chỉnh sửa
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
