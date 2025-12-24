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
      className="bg-background z-40 border-r-0 shadow-none"
      {...props}
    >
      <SidebarHeader className="flex h-16 items-center justify-between px-4 group-data-[collapsible=icon]:px-0">
        <div className="flex w-full items-center justify-center transition-all duration-300 ease-in-out">
          <HeaderLogo
            className="w-full group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:justify-center"
            textClassName="group-data-[collapsible=icon]:hidden opacity-100 transition-all duration-300 translate-x-0"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-none gap-4 overflow-y-auto px-3 py-4 group-data-[collapsible=icon]:px-2">
        {SIDEBAR_GROUPS.map((group) => (
          <SidebarGroup
            key={group.group}
            className="p-0 group-data-[collapsible=icon]:items-center"
          >
            <div className="text-muted-foreground/40 mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.1em] group-data-[collapsible=icon]:hidden">
              {group.group}
            </div>
            <SidebarGroupContent>
              <SidebarMenu
                className="gap-1"
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

      <SidebarFooter className="border-t p-3 group-data-[collapsible=icon]:border-t-0 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Hỗ trợ"
              aria-label="Hỗ trợ"
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 focus-visible:ring-sidebar-ring h-10 min-h-[40px] rounded-lg font-medium transition-all duration-200 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:justify-center"
            >
              <HelpCircle className="size-4.5" aria-hidden="true" />
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
