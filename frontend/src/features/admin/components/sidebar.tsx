"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/shared/ui/sidebar";
import { CircleHelp, Zap } from "lucide-react";
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
      <SidebarHeader className="group-data-[collapsible=icon]:px-0">
        <SidebarMenu className="p-0">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => toggleSidebar()}
              tooltip="Thu gọn / Mở rộng"
              className="h-12 transition-colors px-2"
            >
                <span className="font-bold text-primary text-3xl tracking-tighter leading-none group-data-[collapsible=icon]:hidden whitespace-nowrap">
                  Synapse
                </span>
                <span className="font-bold text-primary text-3xl leading-none hidden group-data-[collapsible=icon]:block">
                  S
                </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="h-px bg-muted-foreground/10 w-full mt-8" />
      </SidebarHeader>

      <SidebarContent className="scrollbar-none gap-2 overflow-y-auto pt-4">
        {SIDEBAR_GROUPS.map((group) => (
          <SidebarGroup
            key={group.group}
            className="group-data-[collapsible=icon]:px-0"
          >
            <div className="text-muted-foreground/50 mb-3 px-0 text-xs font-bold uppercase tracking-widest whitespace-nowrap group-data-[collapsible=icon]:hidden">
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

      <SidebarFooter className="px-6 pb-6 pt-2 group-data-[collapsible=icon]:px-0">
        <div className="h-px bg-muted-foreground/10 w-full mb-4" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Hỗ trợ"
              aria-label="Hỗ trợ"
              className="text-foreground/80 hover:text-foreground hover:bg-muted/50 h-12 font-medium transition-all duration-200 px-2"
            >
              <CircleHelp className="size-6 shrink-0" strokeWidth={2} />
              <span className="group-data-[collapsible=icon]:hidden ml-2 text-sm">
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
