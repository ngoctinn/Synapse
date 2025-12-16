"use client";

import { useFilterParams } from "@/shared/lib/hooks/use-filter-params";
import { FilterButton } from "@/shared/ui/custom/filter-button";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Activity, Crown, User } from "lucide-react";

// Định nghĩa các hạng thành viên với label tiếng Việt
const MEMBERSHIP_TIERS = [
  { id: "SILVER", name: "Bạc (Silver)", icon: "🥈" },
  { id: "GOLD", name: "Vàng (Gold)", icon: "🥇" },
  { id: "PLATINUM", name: "Bạch kim (Platinum)", icon: "💎" },
] as const;

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
  const { searchParams, activeCount, updateParam, clearFilters } =
    useFilterParams({
      filterKeys: ["tiers", "status", "gender"],
    });

  const tier = searchParams.get("tiers");
  const status = searchParams.get("status");
  const gender = searchParams.get("gender");

  const handleTierChange = (value: string) => {
    updateParam("tiers", value === "all" ? null : value);
  };

  const handleStatusChange = (value: string) => {
    updateParam("status", value === "all" ? null : value);
  };

  const handleGenderChange = (value: string) => {
    updateParam("gender", value === "all" ? null : value);
  };

  return (
    <FilterButton
      count={activeCount}
      onClear={clearFilters}
      className="h-9 w-9"
    >
      <div className="grid gap-5 p-1 min-w-[220px]">
        {/* Filter: Trạng thái */}
        <div className="space-y-2">
          <Label
            htmlFor="status"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Activity className="size-3.5" /> Trạng thái
          </Label>
          <Select value={status || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger id="status" className="h-9 w-full bg-background">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter: Hạng thành viên */}
        <div className="space-y-2">
          <Label
            htmlFor="tier"
            className="text-sm font-medium flex items-center gap-2"
          >
            <Crown className="size-3.5" /> Hạng thành viên
          </Label>
          <Select value={tier || "all"} onValueChange={handleTierChange}>
            <SelectTrigger id="tier" className="h-9 w-full bg-background">
              <SelectValue placeholder="Tất cả hạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả hạng</SelectItem>
              {MEMBERSHIP_TIERS.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  <div className="flex items-center gap-2">
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Filter: Giới tính */}
        <div className="space-y-2">
          <Label
            htmlFor="gender"
            className="text-sm font-medium flex items-center gap-2"
          >
            <User className="size-3.5" /> Giới tính
          </Label>
          <Select value={gender || "all"} onValueChange={handleGenderChange}>
            <SelectTrigger id="gender" className="h-9 w-full bg-background">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              {GENDER_OPTIONS.map((g) => (
                <SelectItem key={g.id} value={g.id}>
                  {g.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </FilterButton>
  );
}
