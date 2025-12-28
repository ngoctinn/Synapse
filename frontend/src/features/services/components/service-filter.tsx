"use client";

import { Skill } from "@/features/services";
import { useFilterParams } from "@/shared/lib/hooks/use-filter-params";
import { FilterButton } from "@/shared/ui/custom/filter-button";
import { TagInput } from "@/shared/ui/custom/tag-input";
import { Label } from "@/shared/ui/label";
import { Grid, HStack, Stack } from "@/shared/ui/layout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Slider } from "@/shared/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { ServiceCategory } from "../model/types";

interface ServiceFilterProps {
  availableSkills: Skill[];
  availableCategories: ServiceCategory[];
}

export function ServiceFilter({
  availableSkills,
  availableCategories,
}: ServiceFilterProps) {
  const { searchParams, activeCount, updateParam, updateParams, clearFilters } =
    useFilterParams({
      filterKeys: [
        "min_price",
        "max_price",
        "duration",
        "skill_ids",
        "category_id",
      ],
    });

  const minPrice = Number(searchParams.get("min_price")) || 0;
  const maxPrice = Number(searchParams.get("max_price")) || 10000000;
  const duration = searchParams.get("duration");
  const skillIds =
    searchParams.get("skill_ids")?.split(",").filter(Boolean) || [];
  const categoryId = searchParams.get("category_id");

  const [localPriceRange, setLocalPriceRange] = useState([minPrice, maxPrice]);

  useEffect(() => {
    if (localPriceRange[0] !== minPrice || localPriceRange[1] !== maxPrice) {
      setLocalPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice]);

  const handlePriceRangeChange = (value: number[]) => setLocalPriceRange(value);
  const handlePriceRangeCommit = (value: number[]) => {
    updateParams({
      min_price: value[0] > 0 ? value[0].toString() : null,
      max_price: value[1] < 10000000 ? value[1].toString() : null,
    });
  };

  const handleDurationChange = (value: string) => updateParam("duration", value === "all" ? null : value);
  const handleSkillsChange = (ids: string[]) => updateParam("skill_ids", ids.length > 0 ? ids.join(",") : null);
  const handleCategoryChange = (value: string) => updateParam("category_id", value === "all" ? null : value);

  const skillOptions = availableSkills.map((s) => ({ id: s.id, label: s.name }));

  // Đếm các bộ lọc "ẩn" trong nút Nâng cao
  let advancedCount = 0;
  if (minPrice > 0 || maxPrice < 10000000) advancedCount++;
  if (skillIds.length > 0) advancedCount++;

  return (
    <HStack gap={2} className="items-center">
      {/* 1. Danh mục (Inline - Thao tác nhanh) */}
      <Select value={categoryId || "all"} onValueChange={handleCategoryChange}>
        <SelectTrigger className="h-10 w-[200px] bg-background text-sm">
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
        <SelectTrigger className="h-10 w-[180px] bg-background text-sm">
          <SelectValue placeholder="Thời lượng" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all" className="text-xs">Tất cả thời lượng</SelectItem>
          <SelectItem value="30" className="text-xs">30 phút</SelectItem>
          <SelectItem value="60" className="text-xs">60 phút</SelectItem>
          <SelectItem value="90" className="text-xs">90 phút</SelectItem>
          <SelectItem value="120" className="text-xs">120 phút</SelectItem>
        </SelectContent>
      </Select>

      {/* 3. Nút Nâng cao cho các bộ lọc phức tạp */}
      <FilterButton
        label="Nâng cao"
        icon={SlidersHorizontal}
        count={advancedCount}
        onClear={clearFilters}
        className="h-10 px-3 text-sm"
      >
        <Grid gap={6} className="p-1 min-w-[280px]">
          <Stack gap={4}>
            <Label className="text-sm font-medium">Khoảng giá (VNĐ)</Label>
            <div className="px-1 pb-6 pt-2">
              <Slider
                value={localPriceRange}
                max={10000000}
                step={100000}
                onValueChange={handlePriceRangeChange}
                onValueCommit={handlePriceRangeCommit}
              />
            </div>
          </Stack>

          <Stack gap={3}>
            <Label className="text-sm font-medium">Kỹ năng yêu cầu</Label>
            <TagInput
              options={skillOptions}
              selectedIds={skillIds}
              newTags={[]}
              onSelectedChange={handleSkillsChange}
              onNewTagsChange={() => {}}
              placeholder="Chọn kỹ năng..."
              className="bg-background text-xs"
            />
          </Stack>
        </Grid>
      </FilterButton>
    </HStack>
  );
}
