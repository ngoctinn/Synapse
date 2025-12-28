"use client";

import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { useNotificationStore } from "@/features/notifications/hooks/use-notification-store";
import { UserProfile } from "@/shared/components/layout/components/header/types";
import { useHeader } from "@/shared/lib/header-context";
import { cn } from "@/shared/lib/utils";
import {
  Card,
  Separator,
  SidebarTrigger
} from "@/shared/ui";
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

export function AdminHeader({
  className,
  user,
  loading,
}: AdminHeaderProps) {
  const { state, setTabsSlot } = useHeader();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  // Sử dụng callback ref để đăng ký slot element vào context
  const slotRef = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) {
      setTabsSlot(node);
    }
  }, [setTabsSlot]);

  return (
    <header
      className={cn(
        "sticky top-2 z-30 ml-2 mr-2 shrink-0 transition-all duration-300 ease-in-out",
        className
      )}
    >
      <Card className="flex flex-col border-none shadow-sm overflow-hidden">
        {/* Main Row - h-16 (64px) */}
        <div className="flex h-16 items-center gap-2 px-4 bg-background">
          <div className="flex items-center gap-4 flex-1 overflow-hidden">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4 hidden md:block opacity-40" />

            <div className="flex flex-col items-start gap-1 min-w-fit py-2">
              {state.title && (
                <h1 className="text-base font-bold tracking-tight text-foreground/90 leading-tight">
                  {state.title}
                </h1>
              )}
              {state.subtitle && (
                <p className="text-[11px] text-muted-foreground/70 leading-normal hidden lg:block truncate max-w-[450px]">
                  {state.subtitle}
                </p>
              )}
            </div>

            {/* Gap filler */}
            <div className="flex-1" />

            {/* Đích của Portal cho Tabs */}
            <div
              ref={slotRef}
              className="hidden md:flex items-center px-4"
              id="header-tabs-slot"
            />
          </div>

          <div className="flex items-center gap-3 pr-2">
            <Separator orientation="vertical" className="h-6 opacity-30 hidden md:block" />

            <div className="flex items-center gap-1.5">
              <NotificationPopover>
                <NotificationBell unreadCount={unreadCount} />
              </NotificationPopover>

              <Separator orientation="vertical" className="h-4 mx-1 opacity-50" />
              <UserNav user={user} loading={loading} />
            </div>
          </div>
        </div>
      </Card>
    </header>
  );
}
