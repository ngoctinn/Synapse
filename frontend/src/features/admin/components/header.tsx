"use client";

import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { useNotificationStore } from "@/features/notifications/hooks/use-notification-store";
import { UserProfile } from "@/shared/components/layout/components/header/types";
import { useHeader } from "@/shared/lib/header-context";
import { cn } from "@/shared/lib/utils";
import { Card, Separator, SidebarTrigger } from "@/shared/ui";
import dynamic from "next/dynamic";
import { useCallback } from "react";

const UserNav = dynamic(() => import("./user-nav").then((m) => m.UserNav), {
  ssr: false,
});
const NotificationPopover = dynamic(
  () =>
    import("@/features/notifications/components/notification-popover").then(
      (m) => m.NotificationPopover
    ),
  { ssr: false }
);

interface AdminHeaderProps {
  className?: string;
  user: UserProfile | null;
  loading?: boolean;
}

export function AdminHeader({ className, user, loading }: AdminHeaderProps) {
  const { state, setTabsSlot } = useHeader();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  // Sử dụng callback ref để đăng ký slot element vào context
  const slotRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node !== null) {
        setTabsSlot(node);
      }
    },
    [setTabsSlot]
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-30 shrink-0 transition-all duration-300 ease-in-out",
        className
      )}
    >
      <Card className="flex flex-col overflow-hidden border-none shadow-sm">
        {/* Main Row - h-16 (64px) */}
        <div className="bg-background flex h-16 items-center gap-2 px-4">
          <div className="flex flex-1 items-center gap-4 overflow-hidden">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="hidden h-4 opacity-40 md:block"
            />

            <div className="flex min-w-fit flex-col items-start gap-1 py-2">
              {state.title && (
                <h1 className="text-foreground/90 text-base font-bold leading-tight tracking-tight">
                  {state.title}
                </h1>
              )}
              {/* Subtitle removed as requested */}
            </div>

            {/* Đích của Portal cho Tabs - Moved to left */}
            <div
              ref={slotRef}
              className="hidden items-center px-4 md:flex"
              id="header-tabs-slot"
            />

            {/* Gap filler */}
            <div className="flex-1" />
          </div>

          <div className="flex items-center gap-3 pr-2">
            <Separator
              orientation="vertical"
              className="hidden h-6 opacity-30 md:block"
            />

            <div className="flex items-center gap-1.5">
              <NotificationPopover>
                <NotificationBell unreadCount={unreadCount} />
              </NotificationPopover>

              <Separator
                orientation="vertical"
                className="mx-1 h-4 opacity-50"
              />
              <UserNav user={user} loading={loading} />
            </div>
          </div>
        </div>
      </Card>
    </header>
  );
}
