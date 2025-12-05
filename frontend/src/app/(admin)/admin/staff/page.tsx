import { getPermissions, getSchedules, getSkills, getStaffList, StaffPage } from "@/features/staff"
import { endOfWeek, format, startOfWeek } from "date-fns"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quản lý nhân sự | Synapse",
  description: "Quản lý nhân viên",
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams?.page) || 1

  // Calculate current week for initial schedule
  const today = new Date()
  const start = format(startOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd")
  const end = format(endOfWeek(today, { weekStartsOn: 1 }), "yyyy-MM-dd")

  // Parallel data fetching
  const skillsPromise = getSkills()
  const staffListPromise = getStaffList(page)
  const permissionsPromise = getPermissions()
  const schedulesPromise = getSchedules(start, end)

  // We await skills here because it's needed for the modal in the header immediately,
  // but we pass the promise for the list to be suspended inside StaffPage
  const skills = await skillsPromise
  const permissions = await permissionsPromise
  const schedules = await schedulesPromise

  return (
    <StaffPage
      page={page}
      skills={skills}
      staffListPromise={staffListPromise}
      initialPermissions={permissions}
      initialSchedules={schedules}
    />
  )
}
