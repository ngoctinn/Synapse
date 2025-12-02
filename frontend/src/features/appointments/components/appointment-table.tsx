"use client"

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
import { Calendar, MoreHorizontal } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/shared/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"

// Mock Data Type
interface Appointment {
  id: string
  customerName: string
  serviceName: string
  time: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  staffName: string
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    customerName: "Nguyễn Văn A",
    serviceName: "Cắt tóc nam",
    time: "09:00 - 09:45",
    status: "confirmed",
    staffName: "Trần Văn B",
  },
  {
    id: "2",
    customerName: "Lê Thị C",
    serviceName: "Gội đầu dưỡng sinh",
    time: "10:00 - 11:00",
    status: "pending",
    staffName: "Nguyễn Thị D",
  },
]

interface AppointmentTableProps {
  page?: number
  totalPages?: number
  onPageChange?: (page: number) => void
}

export function AppointmentTable({
  page = 1,
  totalPages = 1,
  onPageChange
}: AppointmentTableProps) {
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

  if (MOCK_APPOINTMENTS.length === 0) {
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
      <div className="flex-1 overflow-auto bg-white border relative">
        <table className="w-full caption-bottom text-sm min-w-[800px]">
          <TableHeader className="sticky top-0 z-10 bg-white shadow-sm">
            <TableRow className="hover:bg-transparent border-b-0">
              <TableHead className="pl-6 bg-white">Khách hàng</TableHead>
              <TableHead className="bg-white">Dịch vụ</TableHead>
              <TableHead className="bg-white">Thời gian</TableHead>
              <TableHead className="bg-white">Nhân viên</TableHead>
              <TableHead className="bg-white">Trạng thái</TableHead>
              <TableHead className="text-right pr-6 bg-white">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_APPOINTMENTS.map((apt, index) => (
              <AnimatedTableRow key={apt.id} index={index}>
                <TableCell className="pl-6 font-medium">
                  {apt.customerName}
                </TableCell>
                <TableCell>{apt.serviceName}</TableCell>
                <TableCell>{apt.time}</TableCell>
                <TableCell>{apt.staffName}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={
                    apt.status === "confirmed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                    apt.status === "pending" ? "bg-yellow-50 text-yellow-700 border-yellow-200" :
                    "bg-slate-50 text-slate-700 border-slate-200"
                  }>
                    {apt.status === "confirmed" ? "Đã xác nhận" :
                     apt.status === "pending" ? "Chờ xác nhận" : apt.status}
                  </Badge>
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
                      <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                      <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
