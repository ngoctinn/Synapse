"use client"

import { Skill } from "@/features/services"
import { FilterBar } from "@/shared/ui/custom/filter-bar"
import { Input } from "@/shared/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, use, useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"
import { InviteStaffTrigger } from "./invite-staff-trigger"
import { PermissionMatrix } from "./permissions/permission-matrix"
import { StaffScheduler } from "./scheduling/staff-scheduler"
import { StaffFilter } from "./staff-filter"
import { StaffTable, StaffTableSkeleton } from "./staff-list/staff-table"

import { Schedule, Staff } from "../model/types"

interface StaffPageProps {
  page: number
  skills: Skill[]
  staffListPromise: Promise<{ data: Staff[]; total: number }>
  initialPermissions: Record<string, Record<string, boolean>>
  initialSchedules: Schedule[]
}

function StaffListWrapper({
  staffListPromise,
  skills,
  page,
}: {
  staffListPromise: Promise<{ data: Staff[]; total: number }>
  skills: Skill[]
  page: number
}) {
  const { data, total } = use(staffListPromise)
  const totalPages = Math.ceil(total / 10)

  return (
    <StaffTable
      data={data}
      skills={skills}
      page={page}
      totalPages={totalPages}
      variant="flush"
      className="border-none"
    />
  )
}


function StaffSchedulerWrapper({
  staffListPromise,
  initialSchedules,
}: {
  staffListPromise: Promise<{ data: Staff[] }>
  initialSchedules: Schedule[]
}) {
  const { data } = use(staffListPromise)
  return <StaffScheduler initialSchedules={initialSchedules} staffList={data} />
}

const Footer = () => (
  <div className="text-center text-sm text-muted-foreground py-6 mt-auto">
    © 2025 Synapse. All rights reserved.
  </div>
)

export function StaffPage({ page, skills, staffListPromise, initialPermissions, initialSchedules }: StaffPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Get active tab from URL or default to 'list'
  const activeTab = searchParams.get("view") || "list"

  // Get initial search query
  const initialSearch = searchParams.get("search")?.toString() || ""

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("view", value)
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams)
    if (term) {
      params.set("search", term)
    } else {
      params.delete("search")
    }
    // Reset page to 1 when searching
    params.set("page", "1")

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }, 300)

  return (
    <div
      className="min-h-screen flex flex-col w-full"
    >
      <Tabs value={activeTab} className="flex flex-col flex-1 w-full gap-0" onValueChange={handleTabChange}>

        <div
          className="sticky top-0 z-40 px-4 py-2 bg-card/95 backdrop-blur-sm border-b flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <TabsList className="h-9 bg-muted/50 p-1 w-full md:w-auto justify-start">
            <TabsTrigger value="list" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 min-w-[100px] transition-all duration-200 flex-1 md:flex-none">Danh sách</TabsTrigger>
            <TabsTrigger value="permissions" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 min-w-[100px] transition-all duration-200 flex-1 md:flex-none">Phân quyền</TabsTrigger>
            <TabsTrigger value="scheduling" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 min-w-[100px] transition-all duration-200 flex-1 md:flex-none">Lịch làm việc</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {activeTab === "list" && (
              <FilterBar
                startContent={
                    <Input
                      placeholder="Tìm kiếm nhân viên..."
                      defaultValue={initialSearch}
                      onChange={(e) => handleSearch(e.target.value)}
                      startContent={<Search className="size-4" />}
                      className="h-9 bg-background w-full md:w-[250px]"
                    />
                }
                endContent={<StaffFilter />}
              />
            )}
            <InviteStaffTrigger skills={skills} />
            {/* Additional toolbars for other tabs can be added here if needed */}
          </div>
        </div>

        <div className="flex-1 p-0 motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-4 duration-300 ease-out flex flex-col">
          <TabsContent value="list" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <div className="p-4 flex-1 flex flex-col gap-4">
              <div className="surface-card overflow-hidden flex-1">
                <Suspense fallback={<StaffTableSkeleton />}>
                  <StaffListWrapper
                    staffListPromise={staffListPromise}
                    skills={skills}
                    page={page}
                  />
                </Suspense>
              </div>
              <Footer />
            </div>
          </TabsContent>

          <TabsContent value="permissions" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <div className="p-4 flex-1 flex flex-col gap-4">
              <div className="surface-card overflow-hidden flex-1">
                <Suspense fallback={<div className="p-8 space-y-4">
                  <div className="h-8 w-1/3 bg-muted animate-pulse rounded" />
                  <div className="h-64 w-full bg-muted animate-pulse rounded-lg" />
                </div>}>
                  <PermissionMatrix initialPermissions={initialPermissions} className="border-none" />
                </Suspense>
              </div>
              <Footer />
            </div>
          </TabsContent>

          <TabsContent value="scheduling" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <div className="p-4 flex-1 flex flex-col gap-4">
              <div className="surface-card overflow-hidden flex-1">
                <Suspense fallback={<div className="flex-1 flex flex-col p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-48 bg-muted animate-pulse rounded" />
                    <div className="flex gap-2">
                      <div className="h-9 w-24 bg-muted animate-pulse rounded" />
                      <div className="h-9 w-24 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                  <div className="flex-1 w-full bg-muted/20 animate-pulse rounded-lg border border-dashed border-muted" />
                </div>}>
                  <StaffSchedulerWrapper
                    staffListPromise={staffListPromise}
                    initialSchedules={initialSchedules}
                  />
                </Suspense>
              </div>
              <Footer />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
