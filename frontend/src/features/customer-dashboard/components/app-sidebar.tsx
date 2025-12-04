"use client"

import { HeaderUserDropdown } from "@/shared/components/layout/components/header"
import { HeaderLogo } from "@/shared/ui/branding/header-logo"
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
    <Sidebar
      collapsible="icon"
      className="border-r border-border/40 bg-sidebar/95 backdrop-blur supports-[backdrop-filter]:bg-sidebar/80"
      {...props}
    >
      <SidebarHeader className="h-16 justify-center px-4 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center w-full transition-all duration-200 ease-in-out">
           <HeaderLogo
              className="w-full"
              textClassName="group-data-[collapsible=icon]:hidden transition-all duration-200"
           />
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <NavMain />
      </SidebarContent>
      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2">
         <div className="rounded-xl border border-border/50 bg-background/50 p-1 shadow-sm transition-all hover:bg-background hover:shadow-md group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:shadow-none">
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
