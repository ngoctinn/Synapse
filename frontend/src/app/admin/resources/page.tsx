
import { ResourcePage } from "@/features/resources"
import { getMaintenanceTasks, getResourceGroups, getResources } from "@/features/resources/actions"

export default async function Page() {
  const resourcesPromise = getResources()
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
