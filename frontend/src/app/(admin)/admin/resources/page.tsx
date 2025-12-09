import { getMaintenanceTasks, getResourceGroups, getResources, ResourcePage } from "@/features/resources";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý tài nguyên | Synapse",
  description: "Quản lý phòng và thiết bị của Spa",
}

interface PageProps {
  searchParams?: Promise<{
    query?: string;
  }>;
}

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ""

  // Parallel data fetching - pass promises to client component
  const resourcesPromise = getResources(query)
  const groupsPromise = getResourceGroups()
  const tasksPromise = getMaintenanceTasks()

  return (
    <ResourcePage
      resourcesPromise={resourcesPromise}
      groupsPromise={groupsPromise}
      tasksPromise={tasksPromise}
    />
  )
}
