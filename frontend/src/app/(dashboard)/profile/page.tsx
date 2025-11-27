import { ProfileForm } from "@/features/customer-dashboard/components/profile-form"
import { getCustomerProfile } from "@/features/customer-dashboard/services/api"
import { Separator } from "@/shared/ui/separator"

export default async function ProfilePage() {
  const user = await getCustomerProfile()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Hồ sơ cá nhân</h3>
        <p className="text-sm text-muted-foreground">
          Quản lý thông tin cá nhân và cài đặt tài khoản.
        </p>
      </div>
      <Separator />
      <div className="max-w-2xl">
        <ProfileForm user={user} />
      </div>
    </div>
  )
}
