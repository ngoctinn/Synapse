"use client";

import { useFilterParams } from "@/shared/lib/hooks/use-filter-params";
import { HStack } from "@/shared/ui/layout/stack";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

const STATUS_OPTIONS = [
  { id: "active", name: "Đang hoạt động" },
  { id: "inactive", name: "Ngưng hoạt động" },
] as const;

const GENDER_OPTIONS = [
  { id: "MALE", name: "Nam" },
  { id: "FEMALE", name: "Nữ" },
  { id: "OTHER", name: "Khác" },
] as const;

export function CustomerFilter() {
  const { searchParams, updateParam } = useFilterParams({
    filterKeys: ["status", "gender"],
  });

  const status = searchParams.get("status");
  const gender = searchParams.get("gender");

  const handleStatusChange = (value: string) => {
    updateParam("status", value === "all" ? null : value);
  };

  const handleGenderChange = (value: string) => {
    updateParam("gender", value === "all" ? null : value);
  };

  return (
    <HStack gap={2} className="items-center">
      {/* Lọc Trạng thái */}
      <Select value={status || "all"} onValueChange={handleStatusChange}>
        <SelectTrigger id="status" className="h-10 w-[180px] bg-background text-sm">
           <SelectValue placeholder="Trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">Tất cả trạng thái</SelectItem>
          {STATUS_OPTIONS.map((s) => (
            <SelectItem key={s.id} value={s.id} className="text-xs">
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Lọc Giới tính */}
      <Select value={gender || "all"} onValueChange={handleGenderChange}>
        <SelectTrigger id="gender" className="h-10 w-[160px] bg-background text-sm">
           <SelectValue placeholder="Giới tính" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">Tất cả giới tính</SelectItem>
          {GENDER_OPTIONS.map((g) => (
            <SelectItem key={g.id} value={g.id} className="text-xs">
              {g.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </HStack>
  );
}
