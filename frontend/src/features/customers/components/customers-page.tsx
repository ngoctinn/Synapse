"use client"

import { SearchInput } from "@/shared/ui/custom/search-input"
import { Suspense, use } from "react"
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

export function CustomersPage({ page, customerListPromise }: CustomersPageProps) {
  return (
    <div
      className="min-h-screen flex flex-col w-full"
    >
        <div
          className="sticky top-0 z-40 px-4 py-3 bg-background border-b flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex flex-col gap-1">
             <h1 className="text-xl font-semibold tracking-tight">Khách hàng</h1>
             <p className="text-sm text-muted-foreground">Quản lý và theo dõi thông tin khách hàng</p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 flex-1 md:flex-none">
                <SearchInput
                  placeholder="Tìm kiếm khách hàng..."
                  className="w-full md:w-[250px] h-9"
                />
                <CustomerFilter />
              </div>
            <CreateCustomerTrigger />
          </div>
        </div>

        <div className="flex-1 p-0 flex flex-col">
            <Suspense fallback={<CustomerTableSkeleton />}>
              <CustomerListWrapper
                customerListPromise={customerListPromise}
                page={page}
              />
            </Suspense>
            <div className="text-center text-sm text-muted-foreground py-6 mt-auto">
                 © 2025 Synapse. All rights reserved.
            </div>
        </div>
    </div>
  )
}
