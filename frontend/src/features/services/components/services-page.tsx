"use client"

import { SearchInput } from "@/shared/ui/custom/search-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { useSearchParams } from "next/navigation"
import { Suspense, use, useState } from "react"
import { Service, Skill } from "../types"
import { CreateServiceDialog } from "./create-service-dialog"
import { CreateSkillDialog } from "./create-skill-dialog"
import { ServiceFilter } from "./service-filter"
import { ServiceTable, ServiceTableSkeleton } from "./service-table"
import { SkillTable } from "./skill-table"

interface ServicesPageProps {
  page: number
  skills: Skill[]
  servicesPromise: Promise<{ data: Service[]; total: number }>
}

function ServiceListWrapper({
  servicesPromise,
  skills,
  page,
}: {
  servicesPromise: Promise<{ data: Service[]; total: number }>
  skills: Skill[]
  page: number
}) {
  const { data, total } = use(servicesPromise)
  const totalPages = Math.ceil(total / 10)

  return (
    <ServiceTable
      services={data}
      availableSkills={skills}
      page={page}
      totalPages={totalPages}
      className="-mx-4 border-x-0 border-t-0 rounded-none shadow-none"
    />
  )
}

const Footer = () => (
    <div className="text-center text-sm text-muted-foreground py-6 mt-auto">
      © 2025 Synapse. All rights reserved.
    </div>
  )

export function ServicesPage({ page, skills, servicesPromise }: ServicesPageProps) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("list")

  // Sync tab with URL if needed, or just keep local state
  // ideally we might want to store tab in URL, but start simple with local state
  // or use the current approach which seems to be client-side tabs.

  const isServiceTab = activeTab === "list"

  return (
    <div className="min-h-screen flex flex-col w-full">
      <Tabs defaultValue="list" className="flex flex-col flex-1 w-full gap-0" onValueChange={setActiveTab}>
        {/* Sticky Header with Tabs and Actions */}
        <div
          className="sticky top-0 z-40 -mx-4 px-4 py-2 bg-background border-b flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            "--header-height": "57px",
            "--header-height-mobile": "109px"
          } as React.CSSProperties}
        >
          <TabsList className="h-9 bg-muted/50 p-1 w-full md:w-auto justify-start">
            <TabsTrigger value="list" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Dịch vụ</TabsTrigger>
            <TabsTrigger value="skills" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Kỹ năng</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-none">
              <SearchInput
                placeholder={isServiceTab ? "Tìm kiếm dịch vụ..." : "Tìm kiếm kỹ năng..."}
                className="w-full md:w-[250px] h-9"
              />
              {isServiceTab && <ServiceFilter availableSkills={skills} />}
            </div>

            {isServiceTab ? (
               <CreateServiceDialog availableSkills={skills} />
            ) : (
               <CreateSkillDialog />
            )}
          </div>
        </div>

        <div className="flex-1 p-0 animate-in fade-in-50 slide-in-from-bottom-4 duration-500 ease-out flex flex-col">
          <TabsContent value="list" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <Suspense fallback={<ServiceTableSkeleton />}>
              <ServiceListWrapper
                servicesPromise={servicesPromise}
                skills={skills}
                page={page}
              />
            </Suspense>
            <Footer />
          </TabsContent>

          <TabsContent value="skills" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
             {/* Note: In a real app we might want to fetch skills paginated here too,
                 but for now we pass all skills as initial data or fetch them similarly.
                 The current architecture passes 'skills' as an array.
                 We'll use a SkillTable that accepts this array.
                 If we need pagination for skills, we might need to adjust the backend/fetching strategy.
                 For now, assuming 'skills' is the full list or paginated list
              */}
              {/* Wait, 'skills' prop is Skill[]. Current SkillTable expects Skill[]. */}
              <SkillTable
                skills={skills}
                className="-mx-4 border-x-0 border-t-0 rounded-none shadow-none"
              />
            <Footer />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
