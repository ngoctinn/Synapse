import { ProfileForm } from "@/features/customer-dashboard";
import { getCustomerProfile } from "@/features/customer-dashboard/index.server";

export default async function ProfilePage() {
  const user = await getCustomerProfile();

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="w-full">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
