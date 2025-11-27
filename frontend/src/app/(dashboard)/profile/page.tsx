import { ProfileForm } from "@/features/customer-dashboard/components/profile-form"
import { getCustomerProfile } from "@/features/customer-dashboard/services/api"

export default async function ProfilePage() {
  const user = await getCustomerProfile()

  return (
    <div className="space-y-6">
      <div className="max-w-2xl">
        <ProfileForm user={user} />
      </div>
    </div>
  )
}
