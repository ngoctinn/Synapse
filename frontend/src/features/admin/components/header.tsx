"use client"

import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb"
import { Bell, LogOut, Settings, User, Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import React from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/shared/ui/sheet"
import { AdminSidebar } from "./sidebar"

// Mapping đường dẫn sang tên hiển thị Tiếng Việt
const BREADCRUMB_MAP: Record<string, string> = {
  admin: "Quản trị",
  overview: "Tổng quan",
  appointments: "Lịch hẹn",
  staff: "Nhân sự",
  services: "Dịch vụ",
  messages: "Tin nhắn",
  notifications: "Thông báo",
  components: "Components",
}

export function AdminHeader({ className }: { className?: string }) {
  const pathname = usePathname()
  
  // Tạo breadcrumbs từ pathname
  const pathSegments = pathname.split("/").filter(Boolean)

  return (
    <header className={cn(
      "flex items-center justify-between h-14 px-6 transition-all duration-300",
      "bg-white/80 backdrop-blur-md border border-white/20 shadow-sm", // Glassmorphism
      className
    )}>
      {/* Breadcrumbs Section */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden -ml-2">
              <Menu className="w-5 h-5 text-slate-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-auto border-none bg-transparent">
            <AdminSidebar className="h-full w-64 shadow-none border-none bg-white/95 backdrop-blur-xl" />
          </SheetContent>
        </Sheet>

        <Breadcrumb className="hidden md:block">
          <BreadcrumbList>
            {pathSegments.map((segment, index) => {
              const isLast = index === pathSegments.length - 1
              const href = `/${pathSegments.slice(0, index + 1).join("/")}`
              const title = BREADCRUMB_MAP[segment] || segment

              return (
                <React.Fragment key={href}>
                  <BreadcrumbItem>
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
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Actions Section */}
      <div className="flex items-center gap-3">
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
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={12} alignOffset={-24} className="w-56 p-2">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Alice Brown</p>
                <p className="text-xs leading-none text-muted-foreground">alice@example.com</p>
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
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 group">
              <LogOut className="mr-2 h-4 w-4 text-red-600 group-hover:translate-x-1 transition-transform" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
