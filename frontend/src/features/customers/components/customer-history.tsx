"use client";

import { Badge, BadgeVariant } from "@/shared/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Calendar, CreditCard, Scissors } from "lucide-react";

// Mock Data
const MOCK_STATS = [
  {
    label: "Tổng lượt ghé",
    value: "12",
    icon: Calendar,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    label: "Tổng chi tiêu",
    value: "15.400.000đ",
    icon: CreditCard,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    label: "Dịch vụ yêu thích",
    value: "Gội đầu dưỡng sinh",
    icon: Scissors,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
];

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
];

const STATUS_MAP: Record<string, { variant: BadgeVariant; label: string }> = {
  COMPLETED: { variant: "emerald", label: "Hoàn thành" },
  CANCELLED: { variant: "red", label: "Đã hủy" },
  PENDING: { variant: "amber", label: "Sắp tới" },
};

export function CustomerHistory() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {MOCK_STATS.map((stat, index) => (
          <div
            key={index}
            className="bg-card flex items-center gap-4 rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className={`rounded-full p-3 ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                {stat.label}
              </p>
              <p className="text-foreground mt-0.5 text-lg font-bold">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* History Table */}
      <div className="bg-card overflow-hidden rounded-xl border shadow-sm">
        <div className="bg-muted/30 border-b p-4">
          <h3 className="text-foreground font-semibold">Lịch sử đặt hẹn</h3>
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
              <TableRow
                key={item.id}
                className="hover:bg-muted/50 cursor-pointer"
              >
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{item.date}</span>
                    <span className="text-muted-foreground text-xs">
                      {item.time}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-foreground font-medium">{item.id}</span>
                  <p className="text-muted-foreground mt-0.5 line-clamp-1 text-xs">
                    {item.service}
                  </p>
                </TableCell>
                <TableCell className="text-sm">{item.staff}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_MAP[item.status]?.variant || "gray"}>
                    {STATUS_MAP[item.status]?.label || item.status}
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
  );
}
