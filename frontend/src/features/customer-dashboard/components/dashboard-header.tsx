"use client"

import { HeaderLogo, HeaderUserDropdown } from "@/shared/components/layout/components/header"
import { UserProfile } from "../model/types"

interface DashboardHeaderProps {
  user: UserProfile
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="header-sticky glass">
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
            onLogout={() => {
              // Logout action sẽ được triển khai sau
            }}
          />
        </div>
      </div>
    </header>
  )
}
