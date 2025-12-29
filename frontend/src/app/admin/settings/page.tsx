import {
  getOperatingHours,
  MOCK_CHANNELS,
  MOCK_EVENTS,
  SettingsPage,
} from "@/features/settings";
import { Suspense } from "react";

export default function AdminSettingsPage() {
  // Tạo promises để truyền xuống component (streaming pattern)
  const operatingHoursPromise = getOperatingHours();

  // Cho notifications, wrap mock data trong Promise để consistent API
  const channelsPromise = Promise.resolve(MOCK_CHANNELS);
  const eventsPromise = Promise.resolve(MOCK_EVENTS);

  return (
    <Suspense fallback={<div>Đang tải cài đặt...</div>}>
      <SettingsPage
        operatingHoursPromise={operatingHoursPromise}
        channelsPromise={channelsPromise}
        eventsPromise={eventsPromise}
      />
    </Suspense>
  );
}
