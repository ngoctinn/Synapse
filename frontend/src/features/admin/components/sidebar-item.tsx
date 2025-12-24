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
        <SidebarMenuItem className="relative">
          {isActive && (
            <div className="bg-primary absolute -left-1 top-0 bottom-0 w-[3.5px] rounded-full transition-all duration-300" />
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                className={cn(
                  "h-10 min-h-[40px] justify-center rounded-lg transition-all duration-200 relative",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className="size-4.5" />
                <span className="sr-only">{item.title}</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="start"
              className="min-w-[180px] rounded-lg -translate-x-1"
            >
              {item.items.map((subItem) => (
                <DropdownMenuItem
                  key={subItem.title}
                  asChild
                  className={cn(
                    "my-0.5 cursor-pointer rounded-md focus:bg-primary/10 focus:text-primary px-3 py-2 text-sm",
                    isSubItemActive(subItem.href) && "bg-primary/10 text-primary font-medium"
                  )}
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
        <SidebarMenuItem className="relative">
          {isActive && (
            <div className="bg-primary absolute -left-1 top-0 bottom-0 w-[3.5px] rounded-full transition-all duration-300" />
          )}
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              className={cn(
                "h-10 min-h-[40px] rounded-lg px-3 font-medium transition-all duration-200",
                isActive
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon className="size-4.5" />
              <span className="truncate">{item.title}</span>
              <ChevronRight
                className="text-muted-foreground/50 ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
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
                      "h-9 min-h-[36px] px-3 rounded-lg transition-all duration-200",
                      isSubItemActive(subItem.href)
                        ? "text-primary font-semibold bg-transparent"
                        : "text-muted-foreground hover:text-foreground hover:bg-transparent"
                    )}
                  >
                    <Link href={subItem.href}>
                      <div
                        className={cn(
                          "h-1 w-1 shrink-0 rounded-full transition-all",
                          isSubItemActive(subItem.href)
                            ? "bg-primary"
                            : "bg-muted-foreground/30 group-hover:bg-muted-foreground/60"
                        )}
                      />
                      <span className="text-xs">{subItem.title}</span>
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
    <SidebarMenuItem className="relative">
      {isActive && (
        <div className="bg-primary absolute -left-1 top-0 bottom-0 w-[3.5px] rounded-full transition-all duration-300" />
      )}
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        aria-label={item.title}
        className={cn(
          "h-10 min-h-[40px] rounded-lg px-3 font-medium transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary active:bg-primary/20"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground active:bg-muted"
        )}
      >
        <Link href={item.href} className="flex items-center gap-3">
          <item.icon
            className={cn(
              "size-4.5 shrink-0 transition-transform duration-200",
              isActive ? "scale-110" : "group-hover:scale-110"
            )}
            aria-hidden="true"
          />
          <span className="truncate group-data-[collapsible=icon]:hidden">
            {item.title}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
