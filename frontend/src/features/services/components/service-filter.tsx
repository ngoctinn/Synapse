"use client";

import { useFilterParams } from "@/shared/lib/hooks/use-filter-params";
import { HStack } from "@/shared/ui/layout";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select";
import { ServiceCategory } from "../model/types";

interface ServiceFilterProps {
  availableCategories: ServiceCategory[];
}

export function ServiceFilter({
  availableCategories,
}: ServiceFilterProps) {
  const { searchParams, updateParam } =
    useFilterParams({
      filterKeys: [
        "duration",
        "category_id",
      ],
    });

  const duration = searchParams.get("duration");
  const categoryId = searchParams.get("category_id");

  const handleDurationChange = (value: string) => updateParam("duration", value === "all" ? null : value);
  const handleCategoryChange = (value: string) => updateParam("category_id", value === "all" ? null : value);

  return (
    <HStack gap={2} className="items-center">
      {/* 1. Danh mục (Inline - Thao tác nhanh) */}
      <Select value={categoryId || "all"} onValueChange={handleCategoryChange}>
        <SelectTrigger className="w-56 bg-background text-sm">
          <SelectValue placeholder="Danh mục" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">Tất cả danh mục</SelectItem>
          {availableCategories.map((cat) => (
            <SelectItem key={cat.id} value={cat.id} className="text-xs">{cat.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* 2. Thời lượng (Inline - Thao tác nhanh) */}
      <Select value={duration || "all"} onValueChange={handleDurationChange}>
        <SelectTrigger className="w-48 bg-background text-sm">
          <SelectValue placeholder="Thời lượng" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">Tất cả thời lượng</SelectItem>
          <SelectItem value="0-30" className="text-xs">Dưới 30 phút</SelectItem>
          <SelectItem value="30-60" className="text-xs">30 - 60 phút</SelectItem>
          <SelectItem value="60-90" className="text-xs">60 - 90 phút</SelectItem>
          <SelectItem value="90-inf" className="text-xs">Trên 90 phút</SelectItem>
        </SelectContent>
      </Select>
    </HStack>
  );
}
