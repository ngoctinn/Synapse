import { CustomersPage } from "@/features/customers"
import { getCustomers } from "@/features/customers/actions"
import { Suspense } from "react"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const pageNumber = Number(page) || 1
  const customerListPromise = getCustomers(pageNumber)

  return (
    <Suspense fallback={<div>Đang tải khách hàng...</div>}>
      <CustomersPage page={pageNumber} customerListPromise={customerListPromise} />
    </Suspense>
  )
}
