"use client"

import { Resource, RoomType } from "@/features/resources"
import { Input } from "@/shared/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Search } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense, use, useState } from "react"
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
      className="border-t"
    />
  )
}


const Footer = () => (
    <div className="text-center text-sm text-muted-foreground py-6 mt-auto">
      © 2025 Synapse. All rights reserved.
    </div>
  )

export function ServicesPage({ page, skills, roomTypes, equipmentList, servicesPromise }: ServicesPageProps) {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("list")



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
          className="sticky top-0 z-40 px-4 py-3 bg-background/95 backdrop-blur-sm border-b flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <TabsList className="h-9 bg-muted/50 p-1 w-full md:w-auto justify-start">
            <TabsTrigger value="list" aria-label="Danh sách dịch vụ" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Dịch vụ</TabsTrigger>
            <TabsTrigger value="skills" aria-label="Danh sách kỹ năng" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Kỹ năng</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 flex-1 md:flex-none">
              <div className="relative w-full md:w-[250px]">
                <Input
                  placeholder={isServiceTab ? "Tìm kiếm dịch vụ..." : "Tìm kiếm kỹ năng..."}
                  startContent={<Search className="size-4 text-muted-foreground" />}
                  className="h-9 bg-background pr-8"
                />
              </div>
              {isServiceTab && <ServiceFilter availableSkills={skills} />}
            </div>

            {isServiceTab ? (
               <CreateServiceWizard availableSkills={skills} availableRoomTypes={roomTypes} availableEquipment={equipmentList} />
            ) : (
               <CreateSkillDialog />
            )}
          </div>
        </div>

        <div className="flex-1 p-0 motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-4 duration-300 ease-out flex flex-col">
          <TabsContent value="list" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
            <Suspense fallback={<ServiceTableSkeleton />}>
              <ServiceListWrapper
                servicesPromise={servicesPromise}
                skills={skills}
                roomTypes={roomTypes}
                equipmentList={equipmentList}
                page={page}
              />
            </Suspense>
            <Footer />
          </TabsContent>

          <TabsContent value="skills" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">


              <SkillTable
                skills={skills}
                className="border-x-0 border-t rounded-none shadow-none"
              />
            <Footer />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
