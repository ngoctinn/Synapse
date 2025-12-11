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
import { Bed, Box, CheckCircle2, Settings, XCircle } from "lucide-react"

export function ResourceFilter() {
  const { searchParams, activeCount, updateParam, clearFilters } =
    useFilterParams({
      filterKeys: ["type", "status"],
    })

  const type = searchParams.get("type")
  const status = searchParams.get("status")

  const handleTypeChange = (value: string) => {
    updateParam("type", value === "all" ? null : value)
  }

  const handleStatusChange = (value: string) => {
    updateParam("status", value === "all" ? null : value)
  }

  return (
    <FilterButton
      count={activeCount}
      onClear={clearFilters}
      className="h-9 w-9"
    >
      <div className="grid gap-6 p-1">

        <div className="space-y-3">
          <Label htmlFor="type" className="text-sm font-medium">Loại tài nguyên</Label>
          <Select value={type || "all"} onValueChange={handleTypeChange}>
            <SelectTrigger id="type" className="h-10 w-full bg-background">
              <SelectValue placeholder="Tất cả loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="ROOM">
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-muted-foreground" />
                  <span>Phòng</span>
                </div>
              </SelectItem>
              <SelectItem value="EQUIPMENT">
                <div className="flex items-center gap-2">
                  <Box className="h-4 w-4 text-muted-foreground" />
                  <span>Thiết bị</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-[1px] bg-border/50" />


        <div className="space-y-3">
          <Label htmlFor="status" className="text-sm font-medium">Trạng thái</Label>
          <Select value={status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger id="status" className="h-10 w-full bg-background">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="ACTIVE">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span>Hoạt động</span>
                </div>
              </SelectItem>
              <SelectItem value="MAINTENANCE">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-warning" />
                  <span>Đang bảo trì</span>
                </div>
              </SelectItem>
              <SelectItem value="INACTIVE">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Ngưng hoạt động</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </FilterButton>
  )
}
