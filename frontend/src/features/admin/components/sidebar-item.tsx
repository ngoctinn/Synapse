"use client";

import { cn } from "@/shared/lib/utils";
import {
    CollapsibleContent as CollapsibleContentRoot,
    Collapsible as CollapsibleRoot,
    CollapsibleTrigger as CollapsibleTriggerRoot,
} from "@/shared/ui/collapsible";
import {
    DropdownMenuContent as DropdownMenuContentRoot,
    DropdownMenu as DropdownMenuRoot,
    DropdownMenuItem as DropdownMenuRootItem,
    DropdownMenuTrigger as DropdownMenuRootTrigger,
} from "@/shared/ui/dropdown-menu";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/shared/ui/sidebar";

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
  const isCollapsed = state === "collapsed";

  const isActive = item.items
    ? pathname.startsWith(item.href)
    : pathname === item.href;

  const isSubItemActive = (href: string) => pathname === href;

  const Icon = item.icon;

  // Render khi thu gọn
  if (isCollapsed) {
    if (item.items) {
      return (
        <SidebarMenuItem>
          <DropdownMenuRoot>
            <DropdownMenuRootTrigger asChild>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                className={cn(
                  "h-12 transition-colors px-2",
                  "group-data-[collapsible=icon]:hover:bg-muted/70 group-data-[collapsible=icon]:data-[active=true]:bg-primary/15",
                  isActive ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <Icon className="size-5 shrink-0" strokeWidth={2} />
              </SidebarMenuButton>
            </DropdownMenuRootTrigger>
            <DropdownMenuContentRoot side="right" align="start" className="min-w-56 ml-4 shadow-premium-md">
              <div className="px-3 py-2 text-xs font-bold text-muted-foreground border-b uppercase mb-1">{item.title}</div>
              <div className="p-1">
                {item.items.map((subItem) => (
                  <DropdownMenuRootItem
                    key={subItem.title}
                    asChild
                    className={cn(
                      "my-0.5 cursor-pointer focus:bg-primary/10 focus:text-primary px-3 py-2 text-sm",
                      isSubItemActive(subItem.href) && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <Link href={subItem.href}>{subItem.title}</Link>
                  </DropdownMenuRootItem>
                ))}
              </div>
            </DropdownMenuContentRoot>
          </DropdownMenuRoot>
        </SidebarMenuItem>
      );
    }

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          isActive={isActive}
          className={cn(
            "h-12 transition-colors px-2",
            "group-data-[collapsible=icon]:hover:bg-muted/70 group-data-[collapsible=icon]:data-[active=true]:bg-primary/15",
            isActive ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
          )}
        >
          <Link href={item.href}>
            <Icon className="size-5 shrink-0" strokeWidth={2} />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Render khi mở rộng
  if (item.items) {
    return (
      <CollapsibleRoot asChild defaultOpen={isActive} className="group/collapsible">
        <SidebarMenuItem>
          <CollapsibleTriggerRoot asChild>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              className={cn(
                "h-12 px-2 transition-colors",
                "group-data-[collapsible=icon]:hover:bg-muted/70 group-data-[collapsible=icon]:data-[active=true]:bg-primary/15",
                isActive ? "bg-primary/5 text-primary font-medium" : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <Icon className="size-5 shrink-0" strokeWidth={2} />
              <span className="truncate text-sm">{item.title}</span>
              <ChevronRight
                className="text-muted-foreground/40 ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90"
                aria-hidden="true"
              />
            </SidebarMenuButton>
          </CollapsibleTriggerRoot>
          <CollapsibleContentRoot>
            <SidebarMenuSub className="border-l ml-5 mr-0 py-1">
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isSubItemActive(subItem.href)}
                    className={cn(
                      "h-12 px-3 transition-colors",
                      isSubItemActive(subItem.href) ? "text-primary font-bold bg-primary/5" : "text-muted-foreground/60 hover:text-foreground/80 hover:bg-transparent"
                    )}
                  >
                    <Link href={subItem.href} className="flex items-center gap-2">
                      <div className={cn("h-1 w-1 shrink-0 rounded-full", isSubItemActive(subItem.href) ? "bg-primary" : "bg-muted-foreground/20")} />
                      <span className="text-[13px]">{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContentRoot>
        </SidebarMenuItem>
      </CollapsibleRoot>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn(
          "h-12 px-2 transition-colors",
          "group-data-[collapsible=icon]:hover:bg-muted/70 group-data-[collapsible=icon]:data-[active=true]:bg-primary/15",
          isActive ? "bg-primary/5 text-primary font-medium" : "text-foreground/80 hover:bg-muted/50 hover:text-foreground"
        )}
      >
        <Link href={item.href} className="flex items-center gap-2">
          <Icon className="size-5 shrink-0" strokeWidth={2} />
          <span className="truncate text-sm">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
