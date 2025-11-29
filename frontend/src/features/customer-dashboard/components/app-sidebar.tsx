"use client"

import { HeaderUserDropdown } from "@/features/layout/components/header"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/shared/ui/sidebar"
import * as React from "react"
import { UserProfile } from "../types"
import { NavMain } from "./nav-main"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserProfile
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            S
          </div>
          <span className="font-semibold truncate">Synapse Spa</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
         <div className="p-2">
            <HeaderUserDropdown
              user={{
                name: user.fullName,
                email: user.email,
                avatar: user.avatarUrl
              }}
              onLogout={() => console.log("Logout")}
            />
         </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
