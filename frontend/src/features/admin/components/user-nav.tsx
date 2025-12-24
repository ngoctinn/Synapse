"use client";

import { logoutAction } from "@/features/auth/actions";
import { UserProfile } from "@/shared/components/layout/components/header/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from "@/shared/ui";
import { LogOut, Settings, User } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface UserNavProps {
  user: UserProfile | null;
  loading?: boolean;
  side?: "bottom" | "top" | "right" | "left";
  align?: "start" | "end" | "center";
}

export function UserNav({
  user,
  loading = false,
  side = "bottom",
  align = "end",
}: UserNavProps) {
  const handleLogout = async () => {
    await logoutAction();
  };

  const displayName = user?.full_name || user?.email || "Admin";
  const displayEmail = user?.email || "";
  const avatarUrl = user?.avatar_url || "";
  const initials = displayName.substring(0, 2).toUpperCase();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="size-8 rounded-full" />
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Avatar className="h-8 w-8 shadow-sm transition-transform hover:scale-105 active:scale-95">
            <AvatarImage src={avatarUrl} alt={displayName} />
            <AvatarFallback className="bg-primary/5 text-primary text-xs font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align={align}
        side={side}
        sideOffset={11}
        forceMount
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {displayEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer">
          <User className="h-4 w-4" />
          <span>Hồ sơ</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Settings className="h-4 w-4" />
          <span>Cài đặt</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
          onSelect={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
