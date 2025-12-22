"use client";

import { useTableSelection } from "@/shared/hooks";
import { formatCurrency } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Column, DataTable } from "@/shared/ui/custom/data-table";
import { DataTableEmptyState } from "@/shared/ui/custom/data-table-empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { BarChart3, Download, FileText } from "lucide-react";
import { useState } from "react";
import { CommissionReportItem } from "../model/types";

interface CommissionReportProps {
  data: CommissionReportItem[];
}

export function CommissionReport({ data }: CommissionReportProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().getMonth() + 1 + "");
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear() + "");

  const columns: Column<CommissionReportItem>[] = [
    {
      header: "Nhân viên",
      accessorKey: "staffName",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.staffName}</span>
          <span className="text-xs text-muted-foreground">{row.role}</span>
        </div>
      ),
    },
    {
      header: "Tổng dịch vụ",
      accessorKey: "totalServices",
      cell: (row) => <div className="text-center">{row.totalServices}</div>,
    },
    {
      header: "Doanh thu",
      accessorKey: "totalRevenue",
      cell: (row) => <div className="font-medium">{formatCurrency(row.totalRevenue)}</div>,
    },
    {
      header: "Tỉ lệ hoa hồng",
      accessorKey: "commissionRate",
      cell: (row) => <Badge variant="outline">{row.commissionRate}%</Badge>,
    },
    {
      header: "Hoa hồng nhận được",
      accessorKey: "totalCommission",
      cell: (row) => <div className="font-bold text-success-foreground">{formatCurrency(row.totalCommission)}</div>,
    },
  ];

  const totalCommission = data.reduce((acc, item) => acc + item.totalCommission, 0);
  const totalRevenue = data.reduce((acc, item) => acc + item.totalRevenue, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-end sm:items-center">
        <div className="flex gap-2">
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Tháng" />
                </SelectTrigger>
                <SelectContent>
                    {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                        <SelectItem key={m} value={m.toString()}>Tháng {m}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Năm" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {}}>Xem báo cáo</Button>
        </div>
        <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" /> Xuất Excel
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng hoa hồng</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCommission)}</div>
            <p className="text-xs text-muted-foreground">Tháng {selectedMonth}/{selectedYear}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu ghi nhận</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
             <p className="text-xs text-muted-foreground">Từ {data.length} nhân viên</p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={data}
        columns={columns}
        keyExtractor={(item) => item.staffId}
        page={1}
        totalPages={1}
        onPageChange={() => {}}
        variant="flush"
        emptyState={
          <DataTableEmptyState
            icon={BarChart3}
            title="Không có dữ liệu"
            description="Không có hoa hồng nào được ghi nhận trong tháng này."
          />
        }
      />
    </div>
  );
}
