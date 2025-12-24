"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";

interface HeaderUserDropdownProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout: () => void;
}

export function HeaderUserDropdown({
  user,
  onLogout,
}: HeaderUserDropdownProps) {
  if (!user) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="ring-offset-background hover:ring-primary/20 focus-visible:ring-primary/30 relative rounded-full transition-all hover:ring-2 focus-visible:ring-2"
        >
          <Avatar className="h-9 w-9 transition-transform hover:scale-105">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 rounded-xl border-white/20 bg-white/80 p-2 shadow-xl backdrop-blur-xl dark:bg-zinc-900/80"
        align="end"
        sideOffset={12}
        alignOffset={-20}
        forceMount
      >
        <DropdownMenuLabel className="p-2 font-normal">
          <div className="flex items-center gap-3">
            <Avatar className="border-border h-10 w-10 border">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-semibold leading-none">{user.name}</p>
              <p className="text-muted-foreground max-w-[140px] truncate text-xs leading-none">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2 bg-black/5 dark:bg-white/10" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            asChild
            className="focus:bg-primary/10 group cursor-pointer"
          >
            <Link
              href="/profile"
              className="flex w-full items-center py-2.5 transition-transform duration-200 group-hover:translate-x-1"
            >
              <User className="text-primary mr-2 size-4 transition-transform group-hover:scale-110" />
              <span className="group-hover:text-primary transition-colors">
                Hồ sơ cá nhân
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="focus:bg-primary/10 group cursor-pointer"
          >
            <Link
              href="/treatments"
              className="flex w-full items-center py-2.5 transition-transform duration-200 group-hover:translate-x-1"
            >
              <CreditCard className="text-primary mr-2 size-4 transition-transform group-hover:scale-110" />
              <span className="group-hover:text-primary transition-colors">
                Gói dịch vụ
              </span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="focus:bg-primary/10 group cursor-pointer"
          >
            <Link
              href="/settings"
              className="flex w-full items-center py-2.5 transition-transform duration-200 group-hover:translate-x-1"
            >
              <Settings className="text-primary mr-2 size-4 transition-transform group-hover:scale-110" />
              <span className="group-hover:text-primary transition-colors">
                Cài đặt
              </span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-2 bg-black/5 dark:bg-white/10" />
        <DropdownMenuGroup>
          <DropdownMenuItem
            asChild
            className="focus:bg-primary/10 group cursor-pointer"
          >
            <Link
              href="/"
              className="flex w-full items-center py-2.5 transition-transform duration-200 group-hover:translate-x-1"
            >
              <LayoutDashboard className="text-primary mr-2 size-4 transition-transform group-hover:scale-110" />
              <span className="group-hover:text-primary transition-colors">
                Dashboard
              </span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-2 bg-black/5 dark:bg-white/10" />
        <DropdownMenuItem
          variant="destructive"
          className="focus:bg-destructive/10 group cursor-pointer py-2.5"
          onClick={onLogout}
        >
          <div className="flex w-full items-center transition-transform duration-200 group-hover:translate-x-1">
            <LogOut className="size-4 transition-transform group-hover:scale-110" />
            <span>Đăng xuất</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
