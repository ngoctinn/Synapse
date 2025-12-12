
import { getEquipmentList, getRoomTypes } from "@/features/resources/actions"
import { ServicesPage } from "@/features/services"
import { getServices, getSkills } from "@/features/services/actions"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>
}) {
  const { page } = await searchParams
  const pageNumber = Number(page) || 1

  const [skillsRes, roomTypesRes, equipmentListRes] = await Promise.all([
    getSkills(),
    getRoomTypes(),
    getEquipmentList()
  ])

  const skills = skillsRes.status === 'success' ? skillsRes.data?.data || [] : []
  const roomTypes = roomTypesRes.status === 'success' ? roomTypesRes.data || [] : []
  const equipmentList = equipmentListRes.status === 'success' ? equipmentListRes.data || [] : []

  const servicesPromise = getServices(pageNumber)

  return (
    <ServicesPage
      page={pageNumber}
      servicesPromise={servicesPromise}
      skills={skills}
      roomTypes={roomTypes}
      equipmentList={equipmentList}
    />
  )
}
