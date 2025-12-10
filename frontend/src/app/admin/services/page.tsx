
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

  const [skillsData, roomTypes, equipmentList] = await Promise.all([
    getSkills(),
    getRoomTypes(),
    getEquipmentList()
  ])

  const servicesPromise = getServices(pageNumber).then(res => ({
      data: res.data,
      total: res.total
  }))

  return (
    <ServicesPage
      page={pageNumber}
      servicesPromise={servicesPromise}
      skills={skillsData.data}
      roomTypes={roomTypes}
      equipmentList={equipmentList}
    />
  )
}
