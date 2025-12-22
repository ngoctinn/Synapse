"use client"

import { PageFooter } from "@/shared/components/layout/components/page-footer"
import { PageContent, PageHeader, PageShell, SurfaceCard } from "@/shared/components/layout/page-layout"
import { AuditLog } from "../types"
import { AuditTable } from "./index"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { cn } from "@/shared/lib/utils"

interface AuditLogsPageProps {
  data: AuditLog[]
  page: number
  totalPages: number
}

export function AuditLogsPage({ data, page, totalPages }: AuditLogsPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const currentAction = searchParams.get("action") || "all"
  const currentEntity = searchParams.get("entityType") || "all"

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === "all") params.delete(key)
    else params.set(key, value)
    params.set("page", "1")
    startTransition(() => router.replace(`${pathname}?${params.toString()}`))
  }

  return (
    <PageShell>
      <PageHeader>
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg font-medium md:text-xl tracking-tight">Nhật ký hệ thống</h1>
          <p className="text-sm text-muted-foreground hidden md:block">
            Theo dõi các hoạt động của người dùng và hệ thống
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Hành động:</span>
            {["all", "create", "update", "delete", "login"].map((act) => (
              <button
                key={act}
                onClick={() => updateFilter("action", act)}
                className={cn(
                  "px-3 py-1 text-xs rounded-full border transition-colors capitalize",
                  currentAction === act
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-accent"
                )}
              >
                {act === "all" ? "Tất cả" : act}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Đối tượng:</span>
            {["all", "treatment", "package", "customer", "warranty"].map((ent) => (
              <button
                key={ent}
                onClick={() => updateFilter("entityType", ent)}
                className={cn(
                  "px-3 py-1 text-xs rounded-full border transition-colors capitalize",
                  currentEntity === ent
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-muted-foreground border-border hover:bg-accent"
                )}
              >
                {ent === "all" ? "Tất cả" : ent}
              </button>
            ))}
          </div>
        </div>
      </PageHeader>

      <PageContent>
        <SurfaceCard className="border-muted/60">
          <AuditTable
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
