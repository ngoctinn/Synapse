"use client";

import { ROLES } from "@/features/staff/model/constants";
import { useFilterParams } from "@/shared/lib/hooks/use-filter-params";
import { HStack } from "@/shared/ui/layout/stack";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

export function StaffFilter() {
  const { searchParams, updateParam } = useFilterParams({
    filterKeys: ["role", "is_active"],
  });

  const role = searchParams.get("role");
  const isActive = searchParams.get("is_active");

  const handleRoleChange = (value: string) => {
    updateParam("role", value === "all" ? null : value);
  };

  const handleStatusChange = (value: string) => {
    updateParam("is_active", value === "all" ? null : value);
  };

  return (
    <HStack gap={2} className="items-center">
      {/* Lọc Vai trò */}
      <Select value={role || "all"} onValueChange={handleRoleChange}>
        <SelectTrigger id="role" className="h-10 w-[180px] bg-background text-sm">
           <SelectValue placeholder="Vai trò" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">Tất cả vai trò</SelectItem>
          {ROLES.map((r) => (
            <SelectItem key={r.id} value={r.id} className="text-xs">
               {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Lọc Trạng thái */}
      <Select value={isActive || "all"} onValueChange={handleStatusChange}>
        <SelectTrigger id="status" className="h-10 w-[180px] bg-background text-sm">
           <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">Tất cả trạng thái</SelectItem>
          <SelectItem value="true" className="text-xs text-success">Hoạt động</SelectItem>
          <SelectItem value="false" className="text-xs text-muted-foreground">Ngừng hoạt động</SelectItem>
        </SelectContent>
      </Select>
    </HStack>
  );
}
