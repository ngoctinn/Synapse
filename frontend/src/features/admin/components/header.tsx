"use client"

import { cn } from "@/shared/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import { InputWithIcon } from "@/shared/ui/custom/input-with-icon"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { Bell, LogOut, Search, Settings, User } from "lucide-react"

export function AdminHeader({ className }: { className?: string }) {
  return (
    <header className={cn("flex items-center justify-between h-12 px-6 bg-white", className)}>
      <div className="flex items-center gap-4">
        {/* Breadcrumb or Page Title placeholder */}
        <h2 className="text-lg font-semibold text-slate-800">Tổng quan</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-80 hidden md:block">
          <InputWithIcon
            icon={Search}
            placeholder="Tìm kiếm..."
            className="bg-white"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative rounded-full w-10 h-10 hover:bg-slate-100 text-slate-600">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </Button>

        <div className="h-8 w-px bg-slate-200 mx-1" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-4 h-12 rounded-full hover:bg-slate-50">
              <Avatar className="w-9 h-9 border border-slate-200">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-xs font-semibold text-slate-700 leading-none">Dr. Alice Brown</p>
                <p className="text-[10px] text-muted-foreground mt-1">Bác sĩ Tim mạch</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Hồ sơ</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
