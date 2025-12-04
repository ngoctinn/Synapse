"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { CreditCard, LayoutDashboard, LogOut, Settings, User } from "lucide-react"
import Link from "next/link"

interface HeaderUserDropdownProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onLogout: () => void
}

export function HeaderUserDropdown({ user, onLogout }: HeaderUserDropdownProps) {
  if (!user) return null

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full cursor-pointer ring-offset-background transition-all hover:ring-2 hover:ring-primary/20 focus-visible:ring-2 focus-visible:ring-primary/30">
          <Avatar className="h-9 w-9 transition-transform hover:scale-105">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2" align="end" sideOffset={12} alignOffset={-20} forceMount>
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-border">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-semibold leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground truncate max-w-[140px]">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer py-2.5 w-full flex items-center">
              <User className="mr-2 h-4 w-4 text-primary" />
              <span>Hồ sơ cá nhân</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/treatments" className="cursor-pointer py-2.5 w-full flex items-center">
              <CreditCard className="mr-2 h-4 w-4 text-primary" />
              <span>Gói dịch vụ</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings" className="cursor-pointer py-2.5 w-full flex items-center">
              <Settings className="mr-2 h-4 w-4 text-primary" />
              <span>Cài đặt</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/" className="cursor-pointer py-2.5 w-full flex items-center">
              <LayoutDashboard className="mr-2 h-4 w-4 text-primary" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem
          className="cursor-pointer py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4 text-destructive" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
