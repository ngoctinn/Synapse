  "use client"

  import { Skill } from "@/features/services/types"
  import { useFilterParams } from "@/shared/lib/hooks/use-filter-params"
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
  import { Slider } from "@/shared/ui/slider"
  import { useEffect, useState } from "react"

  interface ServiceFilterProps {
    availableSkills: Skill[]
  }

  export function ServiceFilter({ availableSkills }: ServiceFilterProps) {
    const { searchParams, activeCount, updateParam, updateParams, clearFilters } =
      useFilterParams({
        filterKeys: ["min_price", "max_price", "duration", "skill_ids"],
      })

    // Lấy giá trị hiện tại
    const minPrice = Number(searchParams.get("min_price")) || 0
    const maxPrice = Number(searchParams.get("max_price")) || 10000000
    const duration = searchParams.get("duration")
    const skillIds =
      searchParams.get("skill_ids")?.split(",").filter(Boolean) || []

    // Local state cho slider để mượt mà khi kéo
    const [localPriceRange, setLocalPriceRange] = useState([minPrice, maxPrice])

    // Đồng bộ local state khi URL params thay đổi
    useEffect(() => {
      setLocalPriceRange([minPrice, maxPrice])
    }, [minPrice, maxPrice])

    // Xử lý khi kéo slider (chỉ update UI local)
    const handlePriceRangeChange = (value: number[]) => {
      setLocalPriceRange(value)
    }

    // Xử lý khi thả chuột (update URL)
    const handlePriceRangeCommit = (value: number[]) => {
      updateParams({
        min_price: value[0] > 0 ? value[0].toString() : null,
        max_price: value[1] < 10000000 ? value[1].toString() : null,
      })
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
        className="h-9 w-9"
      >
        <div className="grid gap-6 p-1">
          {/* Lọc theo Giá */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Khoảng giá</Label>
              <span className="text-xs text-muted-foreground font-medium bg-muted px-2 py-0.5 rounded">
                VND
              </span>
            </div>
            <div className="pt-2 pb-6 px-1">
              <Slider
                defaultValue={[0, 10000000]}
                value={localPriceRange}
                max={10000000}
                step={50000}
                minStepsBetweenThumbs={1}
                onValueChange={handlePriceRangeChange}
                onValueCommit={handlePriceRangeCommit}
                className="py-2"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1.5">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Từ</span>
                <MoneyInput
                  value={minPrice}
                  onChange={handleMinPriceChange}
                  placeholder="0"
                  className="h-9 text-sm bg-background"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Đến</span>
                <MoneyInput
                  value={maxPrice || undefined}
                  onChange={handleMaxPriceChange}
                  placeholder="Max"
                  className="h-9 text-sm bg-background"
                />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-border/50" />

          {/* Lọc theo Thời lượng */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Thời lượng</Label>
            <Select value={duration || "all"} onValueChange={handleDurationChange}>
              <SelectTrigger className="h-10 w-full bg-background">
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

          <div className="h-[1px] bg-border/50" />

          {/* Lọc theo Kỹ năng */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Kỹ năng yêu cầu</Label>
            <TagInput
              options={skillOptions}
              selectedIds={skillIds}
              newTags={[]}
              onSelectedChange={handleSkillsChange}
              onNewTagsChange={() => {}}
              placeholder="Chọn kỹ năng..."
              className="w-full bg-background min-h-[40px]"
            />
          </div>
        </div>
      </FilterButton>
    )
  }
