"use client";

import { Skill } from "@/features/services";
import { useFilterParams } from "@/shared/lib/hooks/use-filter-params";
import { FilterButton } from "@/shared/ui/custom/filter-button";
import { TagInput } from "@/shared/ui/custom/tag-input";

import { NumberInput } from "@/shared/ui/custom/number-input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Slider } from "@/shared/ui/slider";
import { useEffect, useState } from "react";
import { MOCK_CATEGORIES } from "../model/mocks";

interface ServiceFilterProps {
  availableSkills: Skill[];
}

export function ServiceFilter({ availableSkills }: ServiceFilterProps) {
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
    // Avoid unnecessary updates
    if (localPriceRange[0] !== minPrice || localPriceRange[1] !== maxPrice) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalPriceRange([minPrice, maxPrice]);
    }
  }, [minPrice, maxPrice, localPriceRange]);

  const handlePriceRangeChange = (value: number[]) => {
    setLocalPriceRange(value);
  };

  const handlePriceRangeCommit = (value: number[]) => {
    updateParams({
      min_price: value[0] > 0 ? value[0].toString() : null,
      max_price: value[1] < 10000000 ? value[1].toString() : null,
    });
  };

  const handleMinPriceChange = (value: number) => {
    const corrected = Math.min(value, maxPrice);
    updateParam("min_price", corrected > 0 ? corrected.toString() : null);
  };

  const handleMaxPriceChange = (value: number) => {
    const corrected = Math.max(value, minPrice);
    updateParam(
      "max_price",
      corrected > 0 && corrected < 10000000 ? corrected.toString() : null
    );
  };

  const handleDurationChange = (value: string) => {
    updateParam("duration", value === "all" ? null : value);
  };

  const handleSkillsChange = (ids: string[]) => {
    updateParam("skill_ids", ids.length > 0 ? ids.join(",") : null);
  };

  const handleCategoryChange = (value: string) => {
    updateParam("category_id", value === "all" ? null : value);
  };

  const skillOptions = availableSkills.map((s) => ({
    id: s.id,
    label: s.name,
  }));

  return (
    <FilterButton
      isActive={activeCount > 0}
      count={activeCount}
      onClear={clearFilters}
      className="size-9"
    >
      <div className="grid gap-6 p-1">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Khoảng giá</Label>
            <span className="text-muted-foreground bg-muted rounded px-2 py-0.5 text-xs font-medium">
              VND
            </span>
          </div>
          <div className="px-1 pb-6 pt-2">
            <Slider
              defaultValue={[0, 10000000]}
              value={localPriceRange}
              max={10000000}
              step={50000}
              minStepsBetweenThumbs={1}
              onValueChange={handlePriceRangeChange}
              onValueCommit={handlePriceRangeCommit}
              className="focus-visible:ring-ring py-2 focus-visible:ring-[1.5px]"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-1.5">
              <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                Từ
              </span>
              <NumberInput
                min={0}
                value={minPrice}
                onChange={handleMinPriceChange}
                placeholder="0"
                suffix="VNĐ"
                className="bg-background"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <span className="text-muted-foreground text-[10px] font-semibold uppercase tracking-wider">
                Đến
              </span>
              <NumberInput
                min={0}
                value={maxPrice}
                onChange={handleMaxPriceChange}
                placeholder="Tối đa"
                suffix="VNĐ"
                className="bg-background"
              />
            </div>
          </div>
        </div>

        <div className="bg-border/50 h-px" />

        <div className="space-y-3">
          <Label className="text-sm font-medium">Danh mục</Label>
          <Select
            value={categoryId || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="bg-background w-full">
              <SelectValue placeholder="Tất cả danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {MOCK_CATEGORIES.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-border/50 h-px" />

        <div className="space-y-3">
          <Label className="text-sm font-medium">Thời lượng</Label>
          <Select
            value={duration || "all"}
            onValueChange={handleDurationChange}
          >
            <SelectTrigger className="bg-background w-full">
              <SelectValue placeholder="Tất cả thời lượng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thời lượng</SelectItem>
              <SelectItem value="30">30 phút</SelectItem>
              <SelectItem value="45">45 phút</SelectItem>
              <SelectItem value="60">60 phút</SelectItem>
              <SelectItem value="90">90 phút</SelectItem>
              <SelectItem value="120">120 phút</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-border/50 h-px" />

        <div className="space-y-3">
          <Label className="text-sm font-medium">Kỹ năng yêu cầu</Label>
          <TagInput
            options={skillOptions}
            selectedIds={skillIds}
            newTags={[]}
            onSelectedChange={handleSkillsChange}
            onNewTagsChange={() => {}}
            placeholder="Chọn kỹ năng..."
            className="bg-background w-full"
          />
        </div>
      </div>
    </FilterButton>
  );
}
