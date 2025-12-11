"use client"

import { Badge } from "@/shared/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table"
import { Calendar, CreditCard, Scissors } from "lucide-react"

// Mock Data
const MOCK_STATS = [
  {
    label: "Tổng lượt ghé",
    value: "12",
    icon: Calendar,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Tổng chi tiêu",
    value: "15.400.000đ",
    icon: CreditCard,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    label: "Dịch vụ yêu thích",
    value: "Gội đầu dưỡng sinh",
    icon: Scissors,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
]

const MOCK_HISTORY = [
  {
    id: "APT-001",
    date: "10/12/2024",
    time: "14:30",
    service: "Gội đầu dưỡng sinh & Massage cổ vai gáy",
    staff: "Nguyễn Thị KTV",
    status: "COMPLETED",
    amount: "450.000đ",
  },
  {
    id: "APT-002",
    date: "01/12/2024",
    time: "09:00",
    service: "Chăm sóc da mặt chuyên sâu",
    staff: "Trần Văn Senior",
    status: "COMPLETED",
    amount: "800.000đ",
  },
  {
    id: "APT-003",
    date: "20/11/2024",
    time: "16:15",
    service: "Gội đầu thảo dược",
    staff: "Lê Thị C",
    status: "CANCELLED",
    amount: "0đ",
  },
  {
    id: "APT-004",
    date: "05/11/2024",
    time: "10:30",
    service: "Combo Gội + Massage body",
    staff: "Nguyễn Thị KTV",
    status: "COMPLETED",
    amount: "1.200.000đ",
  },
]

const STATUS_Map: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  COMPLETED: "success",
  CANCELLED: "destructive",
  PENDING: "warning",
}

const STATUS_LABEL: Record<string, string> = {
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  PENDING: "Sắp tới",
}

export function CustomerHistory() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MOCK_STATS.map((stat, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow"
          >
            <div className={`p-3 rounded-full ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-lg font-bold text-foreground mt-0.5">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* History Table */}
      <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-muted/30">
          <h3 className="font-semibold text-foreground">Lịch sử đặt hẹn</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[140px]">Thời gian</TableHead>
              <TableHead>Dịch vụ</TableHead>
              <TableHead>Nhân viên</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Tổng tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_HISTORY.map((item) => (
              <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{item.date}</span>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                </TableCell>
                <TableCell>
                    <span className="font-medium text-foreground">{item.id}</span>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.service}</p>
                </TableCell>
                <TableCell className="text-sm">{item.staff}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_Map[item.status]}>
                    {STATUS_LABEL[item.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.amount}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
