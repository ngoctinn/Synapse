"use client"

import { Input } from "@/shared/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Search } from "lucide-react"
import { Suspense, use, useState } from "react"
import { CustomerListResponse } from "../actions"
import { CreateCustomerTrigger } from "./create-customer-trigger"
import { CustomerFilter } from "./customer-filter"
import { CustomerTable, CustomerTableSkeleton } from "./customer-list/customer-table"

interface CustomersPageProps {
  page: number
  customerListPromise: Promise<CustomerListResponse>
}

function CustomerListWrapper({
  customerListPromise,
  page,
}: {
  customerListPromise: Promise<CustomerListResponse>
  page: number
}) {
  const { data, total } = use(customerListPromise)
  const totalPages = Math.ceil(total / 10)

  return (
    <CustomerTable
      data={data}
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

export function CustomersPage({ page, customerListPromise }: CustomersPageProps) {
  const [activeTab, setActiveTab] = useState("list")

  return (
    <div
      className="min-h-screen flex flex-col w-full"
    >
      <Tabs defaultValue="list" className="flex flex-col flex-1 w-full gap-4 p-4" onValueChange={setActiveTab}>

        <div className="flex flex-none flex-col md:flex-row items-center justify-between gap-4">
          <TabsList className="bg-muted/50 p-1 w-full md:w-fit justify-start h-10">
            <TabsTrigger value="list" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 min-w-[100px] transition-all duration-200 flex-1 md:flex-none h-full">Danh sách</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 min-w-[100px] transition-all duration-200 flex-1 md:flex-none h-full">Thông tin</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {activeTab === "list" && (
                <div className="flex items-center gap-2 flex-1 md:flex-none">
                <div className="relative w-full md:w-[250px]">
                    <Input
                        placeholder="Tìm kiếm khách hàng..."
                        startContent={<Search className="size-4 text-muted-foreground" />}
                        className="h-10 bg-background pr-8"
                    />
                </div>
                <CustomerFilter />
                </div>
            )}
            <CreateCustomerTrigger />
          </div>
        </div>

        <div className="flex-1 min-h-0">
            <TabsContent value="list" className="h-full flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
                <div className="surface-card flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-hidden p-4">
                        <Suspense fallback={<CustomerTableSkeleton />}>
                        <CustomerListWrapper
                            customerListPromise={customerListPromise}
                            page={page}
                        />
                        </Suspense>
                    </div>
                    <div className="px-4 pb-2">
                        <Footer />
                    </div>
                </div>
            </TabsContent>

            <TabsContent value="insights" className="h-full mt-0 border-0 p-0 data-[state=inactive]:hidden">
                 <div className="surface-card h-full p-8 text-center text-muted-foreground">
                    <p>Tính năng báo cáo và thông tin chi tiết khách hàng đang được phát triển.</p>
                </div>
            </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
