"use client"

import { useFilterParams } from "@/shared/lib/hooks/use-filter-params"
import { FilterButton } from "@/shared/ui/custom/filter-button"
import { Label } from "@/shared/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/ui/select"
import { Crown } from "lucide-react"

// Định nghĩa các hạng thành viên với label tiếng Việt
const MEMBERSHIP_TIERS = [
  { id: "SILVER", name: "Bạc (Silver)", icon: "🥈" },
  { id: "GOLD", name: "Vàng (Gold)", icon: "🥇" },
  { id: "PLATINUM", name: "Bạch kim (Platinum)", icon: "💎" },
] as const

export function CustomerFilter() {
  const { searchParams, activeCount, updateParam, clearFilters } =
    useFilterParams({
      filterKeys: ["tiers"],
    })

  const tier = searchParams.get("tiers")

  const handleTierChange = (value: string) => {
    updateParam("tiers", value === "all" ? null : value)
  }

  return (
    <FilterButton
      count={activeCount}
      onClear={clearFilters}
      className="h-9 w-9"
    >
      <div className="grid gap-6 p-1">
        <div className="space-y-3">
          <Label htmlFor="tier" className="text-sm font-medium">Hạng thành viên</Label>
          <Select value={tier || "all"} onValueChange={handleTierChange}>
            <SelectTrigger id="tier" className="h-10 w-full bg-background">
              <SelectValue placeholder="Tất cả hạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả hạng</SelectItem>
              {MEMBERSHIP_TIERS.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  <div className="flex items-center gap-2">
                    <Crown className="h-4 w-4 text-accent-foreground" />
                    <span>{t.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </FilterButton>
  )
}
