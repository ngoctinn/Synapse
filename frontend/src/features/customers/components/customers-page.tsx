"use client"

import { SearchInput } from "@/shared/ui/custom/search-input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
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
      className="border-t"
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
      <Tabs defaultValue="list" className="flex flex-col flex-1 w-full gap-0" onValueChange={setActiveTab}>

        <div
          className="sticky top-0 z-40 px-4 py-2 bg-background border-b flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <TabsList className="h-9 bg-muted/50 p-1 w-full md:w-auto justify-start">
            <TabsTrigger value="list" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Danh sách</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 w-28 transition-all duration-200 flex-1 md:flex-none">Thông tin</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {activeTab === "list" && (
                <div className="flex items-center gap-2 flex-1 md:flex-none">
                <SearchInput
                    placeholder="Tìm kiếm khách hàng..."
                    className="w-full md:w-[250px] h-9"
                />
                <CustomerFilter />
                </div>
            )}
            <CreateCustomerTrigger />
          </div>
        </div>

        <div className="flex-1 p-0 motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-4 duration-300 ease-out flex flex-col">
            <TabsContent value="list" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
                <Suspense fallback={<CustomerTableSkeleton />}>
                <CustomerListWrapper
                    customerListPromise={customerListPromise}
                    page={page}
                />
                </Suspense>
                <Footer />
            </TabsContent>

            <TabsContent value="insights" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
                <div className="p-8 text-center text-muted-foreground">
                    <p>Tính năng báo cáo và thông tin chi tiết khách hàng đang được phát triển.</p>
                </div>
                <Footer />
            </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
