"use client"

import { HeaderLogo } from "@/shared/ui/branding/header-logo"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/shared/ui/sidebar"
import { HelpCircle } from "lucide-react"
import { SIDEBAR_ITEMS } from "../constants"
import { SidebarItem } from "./sidebar-item"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      role="navigation"
      aria-label="Menu điều hướng Admin"
      className="border-r border-sidebar-border bg-sidebar/95 backdrop-blur-md supports-[backdrop-filter]:bg-sidebar/80 shadow-sm"
      {...props}
    >
      <SidebarHeader className="h-16 justify-center px-4 group-data-[collapsible=icon]:px-0">
        <div className="flex items-center w-full transition-all duration-200 ease-out group-data-[collapsible=icon]:justify-center">
          <HeaderLogo
            className="w-full group-data-[collapsible=icon]:w-auto"
            textClassName="group-data-[collapsible=icon]:hidden transition-all duration-200"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 group-data-[collapsible=icon]:px-1">
        <SidebarGroup className="group-data-[collapsible=icon]:items-center">
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {SIDEBAR_ITEMS.map((item) => (
                <SidebarItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Hỗ trợ"
              aria-label="Hỗ trợ"
              className="h-11 min-h-[44px] font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-200 ease-out motion-safe:hover:translate-x-1 focus-visible:ring-2 focus-visible:ring-sidebar-ring active:scale-[0.98] active:bg-sidebar-accent/80 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:hover:translate-x-0 group-data-[collapsible=icon]:!size-11 group-data-[collapsible=icon]:!min-h-[44px] rounded-xl"
            >
              <HelpCircle className="size-5" aria-hidden="true" />
              <span className="group-data-[collapsible=icon]:hidden">Hỗ trợ</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
