"use client"

import { logoutAction } from "@/features/auth/actions"
import { NotificationBell } from "@/features/notifications/components/notification-bell"
import { NotificationPopover } from "@/features/notifications/components/notification-popover"
import { useNotificationStore } from "@/features/notifications/hooks/use-notification-store"
import { UserProfile } from "@/shared/components/layout/components/header/types"
import { cn } from "@/shared/lib/utils"
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
} from "@/shared/ui"
import { LogOut, Settings, User } from "lucide-react"
import { usePathname } from "next/navigation"
import React, { useEffect } from "react"

import { getBreadcrumbTitle } from "../constants" // Dùng hàm mới

interface AdminHeaderProps {
  className?: string
  user: UserProfile | null
  loading?: boolean // Thêm loading prop
}

export function AdminHeader({ className, user, loading = false }: AdminHeaderProps) {
  const pathname = usePathname()
  const unreadCount = useNotificationStore(state => state.unreadCount)
  const fetchNotifications = useNotificationStore(state => state.fetchNotifications)

  const pathSegments = pathname.split("/").filter(Boolean)

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleLogout = async () => {
    await logoutAction()
  }

  const displayName = user?.full_name || user?.email || "Admin"
  const displayEmail = user?.email || ""
  const avatarUrl = user?.avatar_url || ""
  const initials = displayName.substring(0, 2).toUpperCase()

  return (
    <header className={cn(
      "flex h-14 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 relative bg-card/50 backdrop-blur-sm border-b",
      className
    )}>
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {pathSegments.map((segment, index) => {
              const isLast = index === pathSegments.length - 1
              const href = `/${pathSegments.slice(0, index + 1).join("/")}`
              const title = getBreadcrumbTitle(segment)

              return (
                <React.Fragment key={href}>
                  <BreadcrumbItem className="hidden md:block">
                    {isLast ? (
                      <BreadcrumbPage className="font-semibold text-slate-800">
                        {title}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href} className="text-slate-500 hover:text-primary">
                        {title}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="ml-auto flex items-center gap-3 px-4">
        {/* Notification Button */}
        <NotificationPopover>
          <NotificationBell unreadCount={unreadCount} />
        </NotificationPopover>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {loading ? (
             <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="hidden md:flex flex-col gap-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2 w-24" />
                </div>
             </div>
        ) : (
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full focus-visible:ring-0">
                <Avatar className="w-8 h-8 border border-slate-200 shadow-sm">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={12} alignOffset={-24} className="w-56 p-2">
                <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">{displayEmail}</p>
                </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer group">
                <User className="mr-2 size-4 group-hover:text-primary transition-colors" />
                <span>Hồ sơ</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer group">
                <Settings className="mr-2 size-4 group-hover:text-primary transition-colors" />
                <span>Cài đặt</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 group" onSelect={handleLogout}>
                <LogOut className="mr-2 size-4 text-red-600 group-hover:translate-x-1 transition-transform" />
                <span>Đăng xuất</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
            </DropdownMenu>
        )}
      </div>
    </header>
  )
}
