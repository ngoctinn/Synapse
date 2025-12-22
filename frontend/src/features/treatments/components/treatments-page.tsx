"use client"

import { PageFooter } from "@/shared/components/layout/components/page-footer"
import { PageContent, PageHeader, PageShell, SurfaceCard } from "@/shared/components/layout/page-layout"
import { FilterBar } from "@/shared/ui/custom/filter-bar"
import { Input } from "@/shared/ui/input"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"
import { CustomerTreatment } from "../types"
import { TreatmentTable } from "./treatment-table"

interface TreatmentsPageProps {
  data: CustomerTreatment[]
  page: number
  totalPages: number
}

export function TreatmentsPage({ data, page, totalPages }: TreatmentsPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const initialSearch = searchParams.get("search")?.toString() || ""

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("search", term)
    } else {
      params.delete("search")
    }
    params.set("page", "1")

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }, 300)

  return (
    <PageShell>
      <PageHeader>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg font-medium md:text-xl tracking-tight">Liệu trình</h1>
          <p className="text-sm text-muted-foreground hidden md:block">
            Theo dõi tiến độ điều trị của khách hàng
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterBar
            startContent={
              <div className="relative w-full md:w-[250px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground/70" />
                <Input
                  type="search"
                  placeholder="Tìm theo tên khách hoặc mã..."
                  defaultValue={initialSearch}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full bg-background pl-9 h-9 border-muted-foreground/20 focus-premium"
                />
              </div>
            }
          />
        </div>
      </PageHeader>

      <PageContent>
        <SurfaceCard className="border-muted/60">
          <TreatmentTable
            data={data}
            page={page}
            totalPages={totalPages}
          />
        </SurfaceCard>
        <PageFooter />
      </PageContent>
    </PageShell>
  )
}
