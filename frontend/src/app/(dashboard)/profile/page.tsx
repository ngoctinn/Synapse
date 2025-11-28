import { ProfileForm, getCustomerProfile } from "@/features/customer-dashboard"

export default async function ProfilePage() {
  const user = await getCustomerProfile()

  return (
    <div className="space-y-6">
      <div className="w-full">
        <ProfileForm user={user} />
      </div>
    </div>
  )
}
