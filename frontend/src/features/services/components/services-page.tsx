"use client"

import { Resource, RoomType } from "@/features/resources"
import { FilterBar } from "@/shared/ui/custom/filter-bar"
import { Input } from "@/shared/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, use, useState, useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Service, Skill } from "../types"
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
  servicesPromise: Promise<{ data: Service[]; total: number }>
}

function ServiceListWrapper({
  servicesPromise,
  skills,
  roomTypes,
  equipmentList,
  page,
}: {
  servicesPromise: Promise<{ data: Service[]; total: number }>
  skills: Skill[]
  roomTypes: RoomType[]
  equipmentList: Resource[]
  page: number
}) {
  const { data, total } = use(servicesPromise)
  const totalPages = Math.ceil(total / 10)

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


const Footer = () => (
    <div className="text-center text-sm text-muted-foreground py-6 mt-auto">
      © 2025 Synapse. All rights reserved.
    </div>
  )

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
    <div
      className="min-h-screen flex flex-col w-full"
      style={
        {
          "--header-height": "53px",
          "--header-height-mobile": "105px",
        } as React.CSSProperties
      }
    >
      <Tabs defaultValue="list" className="flex flex-col flex-1 w-full gap-0" onValueChange={setActiveTab}>

        <div
          className="sticky top-0 z-40 px-4 py-2 bg-card/95 backdrop-blur-sm border-b flex flex-col md:flex-row items-center justify-between gap-4"
        >
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
        </div>

        <div className="flex-1 p-0 motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-4 duration-300 ease-out flex flex-col">
          <TabsContent value="list" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
             <div className="p-4 flex-1 flex flex-col gap-4">
                <div className="surface-card overflow-hidden flex-1">
                    <Suspense fallback={<ServiceTableSkeleton />}>
                    <ServiceListWrapper
                        servicesPromise={servicesPromise}
                        skills={skills}
                        roomTypes={roomTypes}
                        equipmentList={equipmentList}
                        page={page}
                    />
                    </Suspense>
                </div>
                <Footer />
             </div>
          </TabsContent>

          <TabsContent value="skills" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <div className="p-4 flex-1 flex flex-col gap-4">
              <div className="surface-card overflow-hidden flex-1">
                <SkillTable
                  skills={skills}
                  className="border-none"
                />
              </div>
              <Footer />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
