"use client"

import { logoutAction } from "@/features/auth/actions"
import { UserProfile } from "@/features/layout/components/header/types"
import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Separator } from "@/shared/ui/separator"
import { SidebarTrigger } from "@/shared/ui/sidebar"
import { Bell, LogOut, Settings, User } from "lucide-react"
import { usePathname } from "next/navigation"
import React from "react"

// Mapping đường dẫn sang tên hiển thị Tiếng Việt
const BREADCRUMB_MAP: Record<string, string> = {
  admin: "Quản trị",
  overview: "Tổng quan",
  appointments: "Lịch hẹn",
  staff: "Nhân sự",
  permissions: "Phân quyền",
  schedule: "Lịch làm việc",
  services: "Dịch vụ",
  messages: "Tin nhắn",
  notifications: "Thông báo",
  components: "Thành phần giao diện",
}

interface AdminHeaderProps {
  className?: string
  user: UserProfile | null
}

export function AdminHeader({ className, user }: AdminHeaderProps) {
  const pathname = usePathname()

  // Tạo breadcrumbs từ pathname
  const pathSegments = pathname.split("/").filter(Boolean)

  const handleLogout = async () => {
    await logoutAction()
  }

  const displayName = user?.full_name || user?.email || "Admin"
  const displayEmail = user?.email || ""
  const avatarUrl = user?.avatar_url || ""
  const initials = displayName.substring(0, 2).toUpperCase()

  return (
    <header className={cn(
      "flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12",
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
              const title = BREADCRUMB_MAP[segment] || segment

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

      {/* Actions Section */}
      <div className="ml-auto flex items-center gap-3 px-4">
        {/* Notification Button */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full w-9 h-9 hover:bg-slate-100 text-slate-600 transition-transform hover:scale-105"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse" />
        </Button>

        <div className="h-6 w-px bg-slate-200 mx-1" />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 hover:bg-slate-50 transition-all hover:ring-2 hover:ring-primary/10">
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
              <User className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
              <span>Hồ sơ</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer group">
              <Settings className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
              <span>Cài đặt</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 group" onSelect={handleLogout}>
              <LogOut className="mr-2 h-4 w-4 text-red-600 group-hover:translate-x-1 transition-transform" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

