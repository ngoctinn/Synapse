import { NotificationsSettings } from "@/features/settings/components/notifications-settings";
import { MOCK_CHANNELS, MOCK_EVENTS } from "@/features/settings/notifications";

export default function NotificationsPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="flex-none p-6 pb-4">
         <h1 className="text-2xl font-bold tracking-tight">Cấu hình Thông báo</h1>
         <p className="text-muted-foreground mt-1">
            Quản lý kênh gửi và mẫu tin nhắn tự động.
         </p>
      </div>
      <div className="flex-1 p-6 pt-0 overflow-y-auto">
        <NotificationsSettings
          initialChannels={MOCK_CHANNELS}
          initialEvents={MOCK_EVENTS}
        />
      </div>
    </div>
  );
}
