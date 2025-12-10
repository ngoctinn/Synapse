"use client"

import { Button } from "@/shared/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Filter } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

export function CustomerFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedTiers = searchParams.get("tiers")?.split(",") || []

  const handleFilterChange = (key: string, value: string, checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString())
    let newValues = selectedTiers

    if (checked) {
        newValues = [...newValues, value]
    } else {
        newValues = newValues.filter((v) => v !== value)
    }

    if (newValues.length > 0) {
        params.set(key, newValues.join(","))
    } else {
        params.delete(key)
    }

    // Reset page on filter
    params.set("page", "1")

    router.push(`${pathname}?${params.toString()}`)
  }

  const hasFilters = selectedTiers.length > 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2">
          <Filter className="h-4 w-4" />
          Bộ lọc {hasFilters && `(${selectedTiers.length})`}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel>Hạng thành viên</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {["SILVER", "GOLD", "PLATINUM"].map((tier) => (
          <DropdownMenuCheckboxItem
            key={tier}
            checked={selectedTiers.includes(tier)}
            onCheckedChange={(checked) =>
              handleFilterChange("tiers", tier, checked)
            }
          >
            {tier}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
