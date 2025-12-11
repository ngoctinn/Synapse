  "use client"

  import { Skill } from "@/features/services/types"
import { useFilterParams } from "@/shared/lib/hooks/use-filter-params"
import { FilterButton } from "@/shared/ui/custom/filter-button"
import { TagInput } from "@/shared/ui/custom/tag-input"
import { Input } from "@/shared/ui/input"
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


    const minPrice = Number(searchParams.get("min_price")) || 0
    const maxPrice = Number(searchParams.get("max_price")) || 10000000
    const duration = searchParams.get("duration")
    const skillIds =
      searchParams.get("skill_ids")?.split(",").filter(Boolean) || []


    const [localPriceRange, setLocalPriceRange] = useState([minPrice, maxPrice])


    useEffect(() => {
      // Avoid unnecessary updates
      if (localPriceRange[0] !== minPrice || localPriceRange[1] !== maxPrice) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocalPriceRange([minPrice, maxPrice])
      }
    }, [minPrice, maxPrice, localPriceRange])


    const handlePriceRangeChange = (value: number[]) => {
      setLocalPriceRange(value)
    }


    const handlePriceRangeCommit = (value: number[]) => {
      updateParams({
        min_price: value[0] > 0 ? value[0].toString() : null,
        max_price: value[1] < 10000000 ? value[1].toString() : null,
      })
    }


    const handleMinPriceChange = (value: number) => {
      const corrected = Math.min(value, maxPrice)
      updateParam("min_price", corrected > 0 ? corrected.toString() : null)
    }


    const handleMaxPriceChange = (value: number) => {
      const corrected = Math.max(value, minPrice)
      updateParam("max_price", corrected > 0 && corrected < 10000000 ? corrected.toString() : null)
    }


    const handleDurationChange = (value: string) => {
      updateParam("duration", value === "all" ? null : value)
    }


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
                className="py-2 focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1.5">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Từ</span>
                <Input
                  type="number"
                  min={0}
                  value={minPrice}
                  onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                  placeholder="0"
                  endContent={<span className="text-xs text-muted-foreground">VNĐ</span>}
                  className="h-9 text-sm bg-background pr-10"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider">Đến</span>
                <Input
                  type="number"
                  min={0}
                  value={maxPrice || undefined}
                  onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                  placeholder="Max"
                  endContent={<span className="text-xs text-muted-foreground">VNĐ</span>}
                  className="h-9 text-sm bg-background pr-10"
                />
              </div>
            </div>
          </div>

          <div className="h-[1px] bg-border/50" />


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
