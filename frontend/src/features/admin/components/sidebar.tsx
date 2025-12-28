"use client";

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
  useSidebar,
} from "@/shared/ui/sidebar";
import { CircleHelp } from "lucide-react";
import { SIDEBAR_GROUPS } from "../constants";
import { SidebarItem } from "./sidebar-item";

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      role="navigation"
      aria-label="Menu điều hướng Admin"
      className="z-40"
      {...props}
    >
      <SidebarHeader className="group-data-[collapsible=icon]:px-0">
        <SidebarMenu className="p-0">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => toggleSidebar()}
              tooltip="Thu gọn / Mở rộng"
              className="h-12 px-2 transition-colors"
            >
              <span className="text-primary whitespace-nowrap text-3xl font-bold leading-none tracking-tighter group-data-[collapsible=icon]:hidden">
                Synapse
              </span>
              <span className="text-primary hidden text-3xl font-bold leading-none group-data-[collapsible=icon]:block">
                S
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="bg-muted-foreground/10 mt-8 h-px w-full" />
      </SidebarHeader>

      <SidebarContent className="scrollbar-none gap-2 overflow-y-auto pt-4">
        {SIDEBAR_GROUPS.map((group) => (
          <SidebarGroup
            key={group.group}
            className="group-data-[collapsible=icon]:px-0"
          >
            <div className="text-muted-foreground/50 mb-3 whitespace-nowrap px-0 text-xs font-bold uppercase tracking-widest group-data-[collapsible=icon]:hidden">
              {group.group}
            </div>
            <SidebarGroupContent className="w-full">
              <SidebarMenu
                className="w-full gap-1"
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

      <SidebarFooter className="px-6 pb-6 pt-2 group-data-[collapsible=icon]:px-0">
        <div className="bg-muted-foreground/10 mb-4 h-px w-full" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Hỗ trợ"
              aria-label="Hỗ trợ"
              className="text-foreground/80 hover:text-foreground hover:bg-muted/50 h-12 px-2 font-medium transition-all duration-200"
            >
              <CircleHelp className="size-6 shrink-0" strokeWidth={2} />
              <span className="ml-2 text-sm group-data-[collapsible=icon]:hidden">
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
