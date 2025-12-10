
import { StaffPage, getPermissions, getSchedules, getSkills, getStaffList } from "@/features/staff"
import { endOfWeek, format, startOfWeek } from "date-fns"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const pageNumber = Number(page) || 1

  const today = new Date()
  const start = format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd")
  const end = format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd")

  const [skills, permissions, initialSchedules] = await Promise.all([
    getSkills(),
    getPermissions(),
    getSchedules(start, end)
  ])

  const staffListPromise = getStaffList(pageNumber)

  return (
    <StaffPage
      page={pageNumber}
      skills={skills}
      staffListPromise={staffListPromise}
      initialPermissions={permissions}
      initialSchedules={initialSchedules}
    />
  )
}
