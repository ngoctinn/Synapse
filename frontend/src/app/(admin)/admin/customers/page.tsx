import { getCustomers } from "@/features/customers"
import { CustomersPage } from "@/features/customers/components/customers-page"

interface PageProps {
  searchParams: Promise<{
    page?: string
    sort_by?: string
    order?: string
    tiers?: string
    query?: string
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1

  const customerListPromise = getCustomers(page)

  return (
    <CustomersPage
        page={page}
        customerListPromise={customerListPromise}
    />
  )
}
