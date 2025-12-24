"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/sidebar";
import { DASHBOARD_NAV_ITEMS } from "../constants";

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground/70 mb-2 px-2 text-xs font-medium uppercase tracking-wider">
        Khách hàng
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1.5">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname === item.href ||
                  pathname?.startsWith(`${item.href}/`);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="text-muted-foreground hover:bg-primary/5 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary h-9 px-3 font-medium transition-all duration-200 data-[active=true]:font-semibold"
                >
                  <Link
                    href={item.href}
                    className="flex items-center gap-3"
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className="size-5" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
