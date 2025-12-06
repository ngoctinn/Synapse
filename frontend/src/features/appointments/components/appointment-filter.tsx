"use client"

import { useFilterParams } from "@/shared/lib/hooks/use-filter-params"
import { FilterButton } from "@/shared/ui/custom/filter-button"
import { Label } from "@/shared/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select"
import { CheckCircle2, User, XCircle } from "lucide-react"

export function AppointmentFilter() {
  const { searchParams, activeCount, updateParam, clearFilters } =
    useFilterParams({
      filterKeys: ["status", "staffId"],
    })

  const status = searchParams.get("status")
  const staffId = searchParams.get("staffId")

  const handleStatusChange = (value: string) => {
    updateParam("status", value === "all" ? null : value)
  }

  const handleStaffChange = (value: string) => {
    updateParam("staffId", value === "all" ? null : value)
  }

  return (
    <FilterButton
      isActive={activeCount > 0}
      count={activeCount}
      onClear={clearFilters}
    >
      <div className="grid gap-6 p-1">
        {/* Lọc theo Trạng thái */}
        <div className="space-y-3">
          <Label htmlFor="status" className="text-sm font-medium">Trạng thái</Label>
          <Select value={status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger id="status" className="h-10 w-full bg-background">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="h-11 cursor-pointer">Tất cả trạng thái</SelectItem>
              <SelectItem value="confirmed" className="h-11 cursor-pointer">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Đã xác nhận</span>
                </div>
              </SelectItem>
              <SelectItem value="cancelled" className="h-11 cursor-pointer">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Đã hủy</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-[1px] bg-border/50" />

        {/* Lọc theo Nhân viên */}
        <div className="space-y-3">
          <Label htmlFor="staff" className="text-sm font-medium">Nhân viên</Label>
          <Select value={staffId || "all"} onValueChange={handleStaffChange}>
            <SelectTrigger id="staff" className="h-10 w-full bg-background">
                <SelectValue placeholder="Chọn nhân viên" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="all">Tất cả nhân viên</SelectItem>
                <SelectItem value="1">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>Nguyễn Văn A</span>
                    </div>
                </SelectItem>
                {/* Mock data for now */}
            </SelectContent>
          </Select>
        </div>
      </div>
    </FilterButton>
  )
}
