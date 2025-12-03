"use client"

import { Staff } from "@/features/staff/types"

import { FilterButton } from "@/shared/ui/custom/filter-button"
import { Label } from "@/shared/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { format } from "date-fns"
import { useFilterParams } from "@/shared/lib/hooks/use-filter-params"
import { Badge } from "@/shared/ui/badge"
import { DateRangePicker } from "@/shared/ui/custom/date-range-picker"
import { DateRange } from "react-day-picker"

interface AppointmentFilterProps {
  staffList: Staff[]
}

export function AppointmentFilter({ staffList }: AppointmentFilterProps) {
  const { searchParams, activeCount, updateParam, clearFilters } =
    useFilterParams({
      filterKeys: ["status", "staff_id", "date_from", "date_to"],
    })

  // Lấy giá trị hiện tại
  const status = searchParams.get("status")
  const staffId = searchParams.get("staff_id")
  const dateFrom = searchParams.get("date_from")
  const dateTo = searchParams.get("date_to")

  // Chuyển đổi date params sang DateRange object
  const dateRange: DateRange | undefined =
    dateFrom && dateTo
      ? { from: new Date(dateFrom), to: new Date(dateTo) }
      : dateFrom
        ? { from: new Date(dateFrom), to: undefined }
        : undefined

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (value: string) => {
    updateParam("status", value === "all" ? null : value)
  }

  // Xử lý thay đổi nhân viên
  const handleStaffChange = (value: string) => {
    updateParam("staff_id", value === "all" ? null : value)
  }

  // Xử lý thay đổi khoảng thời gian
  const handleDateRangeChange = (range?: DateRange) => {
    if (range?.from) {
      updateParam("date_from", format(range.from, "yyyy-MM-dd"))
    } else {
      updateParam("date_from", null)
    }

    if (range?.to) {
      updateParam("date_to", format(range.to, "yyyy-MM-dd"))
    } else {
      updateParam("date_to", null)
    }
  }

  return (
    <FilterButton
      isActive={activeCount > 0}
      count={activeCount}
      onClear={clearFilters}
    >
      <div className="grid gap-4">
        {/* Lọc theo Trạng thái */}
        <div className="space-y-2">
          <Label>Trạng thái</Label>
          <Select value={status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="pending">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">
                    Chờ xác nhận
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="confirmed">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20">
                    Đã xác nhận
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="completed">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">
                    Hoàn thành
                  </Badge>
                </div>
              </SelectItem>
              <SelectItem value="cancelled">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20">
                    Đã hủy
                  </Badge>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lọc theo Nhân viên */}
        <div className="space-y-2">
          <Label>Nhân viên</Label>
          <Select value={staffId || "all"} onValueChange={handleStaffChange}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {staffList.map((staff) => (
                <SelectItem key={staff.id} value={staff.id}>
                  {staff.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Lọc theo Thời gian */}
        <div className="space-y-2">
          <Label>Khoảng thời gian</Label>
          <DateRangePicker
            date={dateRange}
            setDate={handleDateRangeChange}
            className="w-full"
          />
        </div>
      </div>
    </FilterButton>
  )
}
