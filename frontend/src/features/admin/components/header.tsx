"use client";

import { logoutAction } from "@/features/auth/actions";
import { NotificationBell } from "@/features/notifications/components/notification-bell";
import { useNotificationStore } from "@/features/notifications/hooks/use-notification-store";
import { UserProfile } from "@/shared/components/layout/components/header/types";
import { cn } from "@/shared/lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Separator,
  SidebarTrigger,
  Skeleton, // Thêm Skeleton
} from "@/shared/ui";
import { LogOut, Settings, User } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import dynamic from "next/dynamic";


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

import { getBreadcrumbTitle } from "../constants";

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
  const pathname = usePathname();
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  const pathSegments = pathname.split("/").filter(Boolean);


  return (
    <header
      className={cn(
        "bg-background sticky top-2 z-30 ml-2 mr-2 flex h-14 shrink-0 items-center gap-2 rounded-lg shadow-sm transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12",
        className
      )}
    >
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <nav aria-label="Breadcrumb">
          <Breadcrumb>
            <BreadcrumbList>
              {pathSegments.map((segment, index) => {
                const isLast = index === pathSegments.length - 1;
                const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
                const title = getBreadcrumbTitle(segment);

                return (
                  <React.Fragment key={href}>
                    <BreadcrumbItem className="hidden md:block">
                      {isLast ? (
                        <BreadcrumbPage className="text-foreground font-semibold">
                          {title}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href={href}
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {title}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {!isLast && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </nav>
      </div>

      <div className="ml-auto flex items-center gap-3 px-4">
        {/* Command Menu */}


        {/* Notification Button */}
        <NotificationPopover>
          <NotificationBell unreadCount={unreadCount} />
        </NotificationPopover>

        {/* User Profile */}
        <Separator orientation="vertical" className="h-4 mx-1" />
        <UserNav user={user} loading={loading} />
      </div>
    </header>
  );
}
