import { NotificationsSettings } from "@/features/settings/components/notifications-settings";
import { MOCK_CHANNELS, MOCK_EVENTS } from "@/features/settings/notifications";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="flex-none p-4">
         <h1 className="text-2xl font-bold tracking-tight">Cấu hình Thông báo</h1>
         <p className="text-muted-foreground mt-1">
            Quản lý kênh gửi và mẫu tin nhắn tự động.
         </p>
      </div>
      <div className="flex-1 p-4 pt-0 overflow-y-auto">
        <div className="surface-card p-4">
            <NotificationsSettings
            initialChannels={MOCK_CHANNELS}
            initialEvents={MOCK_EVENTS}
            />
        </div>
      </div>
    </div>
  );
}
