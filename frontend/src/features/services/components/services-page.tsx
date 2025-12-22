"use client"

import { Resource, RoomType } from "@/features/resources"
import { PageFooter } from "@/shared/components/layout/components/page-footer"
import { PageContent, PageHeader, PageShell, SurfaceCard } from "@/shared/components/layout/page-layout"
import { FilterBar } from "@/shared/ui/custom/filter-bar"
import { Input } from "@/shared/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"

import { ActionResponse } from "@/shared/lib/action-response"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, use, useState, useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"
import { PaginatedResponse, Service, Skill } from "../model/types"
import { CreateServiceWizard } from "./create-service-wizard"
import { CreateSkillDialog } from "./create-skill-dialog"
import { ServiceFilter } from "./service-filter"
import { ServiceTable, ServiceTableSkeleton } from "./service-table"
import { SkillTable } from "./skill-table"

interface ServicesPageProps {
  page: number
  skills: Skill[]
  roomTypes: RoomType[]
  equipmentList: Resource[]
  servicesPromise: Promise<ActionResponse<PaginatedResponse<Service>>>
}

function ServiceListWrapper({
  servicesPromise,
  skills,
  roomTypes,
  equipmentList,
  page,
}: {
  servicesPromise: Promise<ActionResponse<PaginatedResponse<Service>>>
  skills: Skill[]
  roomTypes: RoomType[]
  equipmentList: Resource[]
  page: number
}) {
  const servicesRes = use(servicesPromise)

  const { data, total } = servicesRes.status === 'success' && servicesRes.data
    ? servicesRes.data
    : { data: [], total: 0 }

  const totalPages = Math.ceil(total / 10)

  if (servicesRes.status === 'error') {
    return <div className="p-4 text-destructive">Lỗi tải dịch vụ: {servicesRes.message}</div>
  }

  return (
    <ServiceTable
      services={data}
      availableSkills={skills}
      availableRoomTypes={roomTypes}
      availableEquipment={equipmentList}
      page={page}
      totalPages={totalPages}
      variant="flush"
      className="border-none"
    />
  )
}



export function ServicesPage({ page, skills, roomTypes, equipmentList, servicesPromise }: ServicesPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const [activeTab, setActiveTab] = useState("list")

  // Get initial search query from URL
  const initialSearch = searchParams.get("search")?.toString() || ""

  // Debounced search handler - syncs with URL params
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

  const isServiceTab = activeTab === "list"

  return (
    <PageShell>
      <Tabs defaultValue="list" className="flex flex-col flex-1 w-full gap-0" onValueChange={setActiveTab}>

        <PageHeader>
          <TabsList variant="default" size="default">
            <TabsTrigger value="list" aria-label="Danh sách dịch vụ" variant="default" stretch={false}>Dịch vụ</TabsTrigger>
            <TabsTrigger value="skills" aria-label="Danh sách kỹ năng" variant="default" stretch={false}>Kỹ năng</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <FilterBar
                startContent={
                  <Input
                    placeholder={isServiceTab ? "Tìm kiếm dịch vụ..." : "Tìm kiếm kỹ năng..."}
                    defaultValue={initialSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    startContent={<Search className="size-4 text-muted-foreground" />}
                    className="h-9 bg-background w-full md:w-[250px]"
                  />
                }
                endContent={isServiceTab && <ServiceFilter availableSkills={skills} />}
             />

            {isServiceTab ? (
               <CreateServiceWizard availableSkills={skills} availableRoomTypes={roomTypes} availableEquipment={equipmentList} />
            ) : (
               <CreateSkillDialog />
            )}
          </div>
        </PageHeader>

        <div className="flex-1 flex flex-col overflow-hidden page-entry-animation">
          <TabsContent value="list" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
             <PageContent>
                <SurfaceCard>
                    <Suspense fallback={<ServiceTableSkeleton />}>
                    <ServiceListWrapper
                        servicesPromise={servicesPromise}
                        skills={skills}
                        roomTypes={roomTypes}
                        equipmentList={equipmentList}
                        page={page}
                    />
                    </Suspense>
                </SurfaceCard>
                <PageFooter />
             </PageContent>
          </TabsContent>

          <TabsContent value="skills" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <PageContent>
              <SurfaceCard>
                <SkillTable
                  skills={skills}
                  className="border-none"
                />
              </SurfaceCard>
              <PageFooter />
            </PageContent>
          </TabsContent>
        </div>
      </Tabs>
    </PageShell>
  )
}
