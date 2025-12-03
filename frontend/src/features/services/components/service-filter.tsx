"use client"

import { Skill } from "@/features/services/types"
import { FilterButton } from "@/shared/ui/custom/filter-button"
import { MoneyInput } from "@/shared/ui/custom/money-input"
import { TagInput } from "@/shared/ui/custom/tag-input"
import { Label } from "@/shared/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select"
import { useFilterParams } from "@/shared/lib/hooks/use-filter-params"
import { Slider } from "@/shared/ui/slider"

interface ServiceFilterProps {
  availableSkills: Skill[]
}

export function ServiceFilter({ availableSkills }: ServiceFilterProps) {
  const { searchParams, activeCount, updateParam, clearFilters } =
    useFilterParams({
      filterKeys: ["min_price", "max_price", "duration", "skill_ids"],
    })

  // Lấy giá trị hiện tại
  const minPrice = Number(searchParams.get("min_price")) || 0
  const maxPrice = Number(searchParams.get("max_price")) || 10000000 // Mặc định max 10tr nếu chưa chọn
  const duration = searchParams.get("duration")
  const skillIds =
    searchParams.get("skill_ids")?.split(",").filter(Boolean) || []

  // Xử lý thay đổi slider giá
  const handlePriceRangeChange = (value: number[]) => {
    updateParam("min_price", value[0] > 0 ? value[0].toString() : null)
    updateParam("max_price", value[1] < 10000000 ? value[1].toString() : null)
  }

  // Xử lý thay đổi input giá min
  const handleMinPriceChange = (value: number) => {
    updateParam("min_price", value > 0 ? value.toString() : null)
  }

  // Xử lý thay đổi input giá max
  const handleMaxPriceChange = (value: number) => {
    updateParam("max_price", value > 0 ? value.toString() : null)
  }

  // Xử lý thay đổi thời lượng
  const handleDurationChange = (value: string) => {
    updateParam("duration", value === "all" ? null : value)
  }

  // Xử lý thay đổi kỹ năng
  const handleSkillsChange = (ids: string[]) => {
    updateParam("skill_ids", ids.length > 0 ? ids.join(",") : null)
  }

  const skillOptions = availableSkills.map((s) => ({ id: s.id, label: s.name }))

  return (
    <FilterButton
      isActive={activeCount > 0}
      count={activeCount}
      onClear={clearFilters}
    >
      <div className="grid gap-6">
        {/* Lọc theo Giá */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Khoảng giá</Label>
            <span className="text-xs text-muted-foreground">
              (VND)
            </span>
          </div>
          <Slider
            defaultValue={[0, 10000000]}
            value={[minPrice, maxPrice || 10000000]}
            max={10000000}
            step={100000}
            minStepsBetweenThumbs={1}
            onValueChange={handlePriceRangeChange}
            className="py-2"
          />
          <div className="flex items-center gap-2">
            <MoneyInput
              value={minPrice}
              onChange={handleMinPriceChange}
              placeholder="Min"
              className="h-8 text-xs"
            />
            <span className="text-muted-foreground">-</span>
            <MoneyInput
              value={maxPrice || undefined}
              onChange={handleMaxPriceChange}
              placeholder="Max"
              className="h-8 text-xs"
            />
          </div>
        </div>

        {/* Lọc theo Thời lượng */}
        <div className="space-y-2">
          <Label>Thời lượng</Label>
          <Select value={duration || "all"} onValueChange={handleDurationChange}>
            <SelectTrigger className="h-9 w-full">
              <SelectValue placeholder="Tất cả" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="30">30 phút</SelectItem>
              <SelectItem value="45">45 phút</SelectItem>
              <SelectItem value="60">60 phút</SelectItem>
              <SelectItem value="90">90 phút</SelectItem>
              <SelectItem value="120">120 phút</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lọc theo Kỹ năng */}
        <div className="space-y-2">
          <Label>Kỹ năng yêu cầu</Label>
          <TagInput
            options={skillOptions}
            selectedIds={skillIds}
            newTags={[]}
            onSelectedChange={handleSkillsChange}
            onNewTagsChange={() => {}}
            placeholder="Chọn kỹ năng..."
            className="w-full"
          />
        </div>
      </div>
    </FilterButton>
  )
}
