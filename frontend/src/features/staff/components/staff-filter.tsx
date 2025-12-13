"use client"

import { ROLES } from "@/features/staff/model/constants"
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
import { CheckCircle2, UserCog, XCircle } from "lucide-react"

export function StaffFilter() {
  const { searchParams, activeCount, updateParam, clearFilters } =
    useFilterParams({
      filterKeys: ["role", "is_active"],
    })


  const role = searchParams.get("role")
  const isActive = searchParams.get("is_active")


  const handleRoleChange = (value: string) => {
    updateParam("role", value === "all" ? null : value)
  }


  const handleStatusChange = (value: string) => {
    updateParam("is_active", value === "all" ? null : value)
  }

  return (
    <FilterButton
      count={activeCount}
      onClear={clearFilters}
      className="h-9 w-9"
    >
      <div className="grid gap-6 p-1">

        <div className="space-y-3">
          <Label htmlFor="role" className="text-sm font-medium">Vai trò</Label>
          <Select value={role || "all"} onValueChange={handleRoleChange}>
            <SelectTrigger id="role" className="h-10 w-full bg-background">
              <SelectValue placeholder="Tất cả vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              {ROLES.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  <div className="flex items-center gap-2">
                    <UserCog className="size-4 text-muted-foreground" />
                    <span>{role.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="h-[1px] bg-border/50" />


        <div className="space-y-3">
          <Label htmlFor="status" className="text-sm font-medium">Trạng thái</Label>
          <Select value={isActive || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger id="status" className="h-10 w-full bg-background">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="true">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-success" />
                  <span>Hoạt động</span>
                </div>
              </SelectItem>
              <SelectItem value="false">
                <div className="flex items-center gap-2">
                  <XCircle className="size-4 text-muted-foreground" />
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
