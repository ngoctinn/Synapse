
import { CustomersPage } from "@/features/customers"
import { getCustomers } from "@/features/customers/actions"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const pageNumber = Number(page) || 1
  const customerListPromise = getCustomers(pageNumber)

  return <CustomersPage page={pageNumber} customerListPromise={customerListPromise} />
}
