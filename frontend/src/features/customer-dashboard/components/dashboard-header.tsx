"use client"

import { HeaderLogo, HeaderUserDropdown } from "@/features/layout/components/header"
import { UserProfile } from "../types"

interface DashboardHeaderProps {
  user: UserProfile
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <HeaderLogo />
        </div>

        {/* Mobile Logo (Centered or Left) */}
        <div className="flex flex-1 md:hidden">
            <HeaderLogo />
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          <HeaderUserDropdown
            user={{
                name: user.fullName,
                email: user.email,
                avatar: user.avatarUrl
            }}
            onLogout={() => console.log("Logout")}
          />
        </div>
      </div>
    </header>
  )
}
