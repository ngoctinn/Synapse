"use client";

import { cn } from "@/shared/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/shared/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarItem as SidebarItemType } from "../constants";

interface SidebarItemProps {
  item: SidebarItemType;
}

export function SidebarItem({ item }: SidebarItemProps) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const Icon = item.icon;
  // Helper: Exact match for leaf nodes, Prefix match for parent nodes
  const isActive = item.items
    ? pathname.startsWith(item.href)
    : pathname === item.href;

  // Helper to check if a sub-item is active (Exact match)
  const isSubItemActive = (href: string) => pathname === href;

  if (item.items) {
    if (state === "collapsed") {
      return (
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                className={cn(
                  "h-10 min-h-[40px] justify-center rounded-xl font-medium transition-all duration-200 ease-out",
                  "group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!min-h-[40px]",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "focus-visible:ring-sidebar-ring focus-visible:ring-2",
                  "active:bg-sidebar-accent/80 active:scale-[0.98]",
                  "data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-bold"
                )}
              >
                <Icon className="size-5" />
                <span className="sr-only">{item.title}</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="start"
              className="min-w-[180px] rounded-xl"
            >
              {item.items.map((subItem) => (
                <DropdownMenuItem
                  key={subItem.title}
                  asChild
                  className="focus:bg-sidebar-accent focus:text-sidebar-accent-foreground my-0.5 cursor-pointer rounded-lg"
                >
                  <Link href={subItem.href}>{subItem.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      );
    }

    return (
      <Collapsible asChild defaultOpen={isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              className={cn(
                "h-10 min-h-[40px] rounded-xl font-medium transition-all duration-200 ease-out",
                "group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!min-h-[40px]",
                "group-hover/menu-item:bg-sidebar-accent group-hover/menu-item:text-sidebar-accent-foreground",
                "focus-visible:ring-sidebar-ring focus-visible:ring-2",
                "active:bg-sidebar-accent/80 active:scale-[0.98]",
                "data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-bold",
                "motion-safe:hover:translate-x-1"
              )}
            >
              <Icon className="size-5" />
              <span className="truncate">{item.title}</span>
              <ChevronRight
                className="text-sidebar-foreground/50 group-hover/menu-item:text-sidebar-foreground ml-auto size-4 transition-transform duration-200 ease-out group-data-[state=open]/collapsible:rotate-90"
                aria-hidden="true"
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub className="border-sidebar-border/50 ml-5 mr-0 border-l px-0 py-1">
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isSubItemActive(subItem.href)}
                    className={cn(
                      "h-9 min-h-[36px] rounded-lg transition-all duration-200 ease-out",
                      // Update hover/active states: No background change, only text color
                      "hover:text-primary hover:bg-transparent",
                      "data-[active=true]:text-primary data-[active=true]:bg-transparent data-[active=true]:font-medium",
                      // Default text color for inactive items
                      !isSubItemActive(subItem.href) && "text-muted-foreground"
                    )}
                  >
                    <Link href={subItem.href}>
                      <div
                        className={cn(
                          "h-1.5 w-1.5 shrink-0 rounded-full transition-all",
                          isSubItemActive(subItem.href)
                            ? "bg-primary"
                            : "bg-muted-foreground/40 group-hover:bg-primary/60"
                        )}
                      />
                      <span className="truncate">{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn(
          "h-10 min-h-[40px] rounded-xl font-medium transition-all duration-200 ease-out",
          "group-data-[collapsible=icon]:!size-10 group-data-[collapsible=icon]:!min-h-[40px] group-data-[collapsible=icon]:justify-center",
          "focus-visible:ring-sidebar-ring focus-visible:ring-2",
          "active:bg-sidebar-accent/80 active:scale-[0.98]",
          "data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-bold",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:hover:translate-x-0 motion-safe:hover:translate-x-1"
        )}
      >
        <Link href={item.href} className="flex items-center gap-3">
          <Icon className="size-5" />
          <span className="truncate group-data-[collapsible=icon]:hidden">
            {item.title}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
