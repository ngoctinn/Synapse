"use client"

import { FilterBar } from "@/shared/ui/custom/filter-bar"
import { Input } from "@/shared/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs"
import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Suspense, use, useTransition } from "react"
import { useDebouncedCallback } from "use-debounce"
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

        <div className="sticky top-0 z-40 px-4 py-2 bg-card/95 backdrop-blur-sm border-b flex flex-col md:flex-row items-center justify-between gap-4">
          <TabsList className="h-9 bg-muted/50 p-1 w-full md:w-auto justify-start">
            <TabsTrigger value="list" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 min-w-[100px] transition-all duration-200 flex-1 md:flex-none">Danh sách</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium px-4 min-w-[100px] transition-all duration-200 flex-1 md:flex-none">Thông tin</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {activeTab === "list" && (
                <FilterBar
                    startContent={
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                placeholder="Tìm kiếm khách hàng..."
                                defaultValue={initialSearch}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="h-9 bg-background pl-9 pr-4 w-full md:w-[250px]"
                            />
                        </div>
                    }
                    endContent={<CustomerFilter />}
                />
            )}
            <CreateCustomerTrigger />
          </div>
        </div>

        <div className="flex-1 p-0 motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-4 duration-300 ease-out flex flex-col">
            <TabsContent value="list" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
               <div className="p-4 flex-1 flex flex-col gap-4">
                <div className="surface-card overflow-hidden flex-1">
                        <Suspense fallback={<CustomerTableSkeleton />}>
                        <CustomerListWrapper
                            customerListPromise={customerListPromise}
                            page={page}
                        />
                        </Suspense>
                    </div>
                    <Footer />
                </div>
            </TabsContent>

            <TabsContent value="insights" className="flex-1 flex flex-col mt-0 border-0 p-0 data-[state=inactive]:hidden">
               <div className="p-4 flex-1 flex flex-col gap-4">
                 <div className="surface-card flex-1 p-8 text-center text-muted-foreground">
                    <p>Tính năng báo cáo và thông tin chi tiết khách hàng đang được phát triển.</p>
                 </div>
                 <Footer />
               </div>
            </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
