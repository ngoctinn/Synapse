"use client";

import { HeaderLogo } from "@/shared/ui/branding/header-logo";
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
} from "@/shared/ui/sidebar";
import { HelpCircle } from "lucide-react";
import { SIDEBAR_GROUPS } from "../constants";
import { SidebarItem } from "./sidebar-item";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      role="navigation"
      aria-label="Menu điều hướng Admin"
      className="bg-background z-30 border-r-0 shadow-none"
      {...props}
    >
      <SidebarHeader className="h-16 justify-center px-3 group-data-[collapsible=icon]:px-0">
        <div className="flex w-full items-center justify-center transition-all duration-200 ease-out">
          <HeaderLogo
            className="w-full group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center"
            textClassName="group-data-[collapsible=icon]:hidden transition-all duration-200"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-none px-2 py-2 group-data-[collapsible=icon]:px-1">
        {SIDEBAR_GROUPS.map((group) => (
          <SidebarGroup
            key={group.group}
            className="group-data-[collapsible=icon]:items-center"
          >
            <div className="text-muted-foreground/50 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider group-data-[collapsible=icon]:hidden">
              {group.group}
            </div>
            <SidebarGroupContent>
              <SidebarMenu
                className="gap-2"
                aria-label={`Danh mục ${group.group}`}
              >
                {group.items.map((item) => (
                  <SidebarItem key={item.title} item={item} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Hỗ trợ"
              aria-label="Hỗ trợ"
              className="text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent focus-visible:ring-sidebar-ring active:bg-sidebar-accent/80 h-11 min-h-[44px] rounded-xl font-medium transition-all duration-200 ease-out focus-visible:ring-2 active:scale-[0.98] group-data-[collapsible=icon]:!size-11 group-data-[collapsible=icon]:!min-h-[44px] group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:hover:translate-x-0 motion-safe:hover:translate-x-1"
            >
              <HelpCircle className="size-5" aria-hidden="true" />
              <span className="group-data-[collapsible=icon]:hidden">
                Hỗ trợ
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
