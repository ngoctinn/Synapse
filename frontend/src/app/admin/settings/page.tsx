import { SettingsPage } from "@/features/settings/components/settings-page";
import { MOCK_CHANNELS, MOCK_EVENTS } from "@/features/settings/notifications";
import { getOperatingHours } from "@/features/settings/operating-hours";

export default function AdminSettingsPage() {
  // Tạo promises để truyền xuống component (streaming pattern)
  const operatingHoursPromise = getOperatingHours();

  // Cho notifications, wrap mock data trong Promise để consistent API
  const channelsPromise = Promise.resolve(MOCK_CHANNELS);
  const eventsPromise = Promise.resolve(MOCK_EVENTS);

  return (
    <SettingsPage
      operatingHoursPromise={operatingHoursPromise}
      channelsPromise={channelsPromise}
      eventsPromise={eventsPromise}
    />
  );
}
