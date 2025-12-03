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
import { CheckCircle2, Stethoscope, UserCog, XCircle } from "lucide-react"

export function StaffFilter() {
  const { searchParams, activeCount, updateParam, clearFilters } =
    useFilterParams({
      filterKeys: ["role", "is_active"],
    })

  // Lấy giá trị hiện tại từ URL
  const role = searchParams.get("role")
  const isActive = searchParams.get("is_active")

  // Xử lý thay đổi vai trò
  const handleRoleChange = (value: string) => {
    updateParam("role", value === "all" ? null : value)
  }

  // Xử lý thay đổi trạng thái
  const handleStatusChange = (value: string) => {
    updateParam("is_active", value === "all" ? null : value)
  }

  return (
    <FilterButton
      isActive={activeCount > 0}
      count={activeCount}
      onClear={clearFilters}
    >
      <div className="grid gap-4">
        {/* Lọc theo Vai trò */}
        <div className="space-y-2">
          <Label htmlFor="role">Vai trò</Label>
          <Select value={role || "all"} onValueChange={handleRoleChange}>
            <SelectTrigger id="role" className="h-9 w-full">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-muted-foreground" />
                  <span>Quản trị viên</span>
                </div>
              </SelectItem>
              <SelectItem value="receptionist">
                <div className="flex items-center gap-2">
                  <UserCog className="h-4 w-4 text-muted-foreground" />
                  <span>Lễ tân</span>
                </div>
              </SelectItem>
              <SelectItem value="technician">
                <div className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  <span>Kỹ thuật viên</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lọc theo Trạng thái */}
        <div className="space-y-2">
          <Label htmlFor="status">Trạng thái</Label>
          <Select value={isActive || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger id="status" className="h-9 w-full">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="true">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Hoạt động</span>
                </div>
              </SelectItem>
              <SelectItem value="false">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Ngừng hoạt động</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </FilterButton>
  )
}
