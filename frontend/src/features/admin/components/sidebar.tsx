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
import { UserProfile } from "@/shared/components/layout/components/header/types";

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function AdminSidebar({
  ...props
}: AdminSidebarProps) {
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
      <SidebarHeader className="h-14 flex items-center px-3">
        <SidebarMenu className="w-full">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => toggleSidebar()}
              tooltip="Thu gọn / Mở rộng"
              className="h-9 w-full justify-start rounded-lg transition-colors px-2.5 hover:bg-muted/80"
            >
              <span className="font-bold text-primary text-base tracking-tight uppercase group-data-[collapsible=icon]:hidden truncate">
                Synapse
              </span>
              <span className="font-bold text-primary text-xl hidden group-data-[collapsible=icon]:block">
                S
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="scrollbar-none gap-2 overflow-y-auto py-4">
        {SIDEBAR_GROUPS.map((group) => (
          <SidebarGroup
            key={group.group}
            className="p-0"
          >
            <div className="text-muted-foreground/40 mb-2 px-6 text-[10px] font-bold uppercase tracking-[0.1em] group-data-[collapsible=icon]:hidden">
              {group.group}
            </div>
            <SidebarGroupContent className="w-full">
              <SidebarMenu
                className="gap-1 w-full"
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

      <SidebarFooter className="p-3 gap-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Hỗ trợ"
              aria-label="Hỗ trợ"
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 h-9 rounded-lg font-medium transition-all duration-200 justify-start px-2.5"
            >
              <CircleHelp className="size-6 shrink-0" strokeWidth={2} />
              <span className="group-data-[collapsible=icon]:hidden ml-3">
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
