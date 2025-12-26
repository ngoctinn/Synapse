"use client";

import { ROLES } from "@/features/staff/model/constants";
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
import { ActionResponse } from "@/shared/lib/action-response";
import { CheckCircle2, UserCog, XCircle } from "lucide-react";
import { Stack, Group, Grid } from "@/shared/ui/layout";

export function StaffFilter() {
  const { searchParams, activeCount, updateParam, clearFilters } =
    useFilterParams({
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
    <FilterButton
      count={activeCount}
      onClear={clearFilters}
    >
      <Grid gap={6} className="p-1">
        <Stack gap={3}>
          <Label htmlFor="role" className="text-sm font-medium">
            Vai trò
          </Label>
          <Select value={role || "all"} onValueChange={handleRoleChange}>
            <SelectTrigger id="role" className="bg-background w-full">
              <SelectValue placeholder="Tất cả vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              {ROLES.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  <Group align="center" gap={2}>
                    <UserCog className="text-muted-foreground" size={16} />
                    <span>{role.name}</span>
                  </Group>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Stack>

        <div className="bg-border/50 h-px" />

        <Stack gap={3}>
          <Label htmlFor="status" className="text-sm font-medium">
            Trạng thái
          </Label>
          <Select value={isActive || "all"} onValueChange={handleStatusChange}>
            <SelectTrigger id="status" className="bg-background w-full">
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="true">
                <Group align="center" gap={2}>
                  <CheckCircle2 className="text-success" size={16} />
                  <span>Hoạt động</span>
                </Group>
              </SelectItem>
              <SelectItem value="false">
                <Group align="center" gap={2}>
                  <XCircle className="text-muted-foreground" size={16} />
                  <span>Ngừng hoạt động</span>
                </Group>
              </SelectItem>
            </SelectContent>
          </Select>
        </Stack>
      </Grid>
    </FilterButton>
  );
}
