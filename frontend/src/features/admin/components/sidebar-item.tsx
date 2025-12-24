"use client";

import { cn } from "@/shared/lib/utils";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/shared/ui/sidebar";
import {
  Collapsible as CollapsibleRoot,
  CollapsibleContent as CollapsibleContentRoot,
  CollapsibleTrigger as CollapsibleTriggerRoot,
} from "@/shared/ui/collapsible";
import {
  DropdownMenu as DropdownMenuRoot,
  DropdownMenuContent as DropdownMenuContentRoot,
  DropdownMenuItem as DropdownMenuRootItem,
  DropdownMenuTrigger as DropdownMenuRootTrigger,
} from "@/shared/ui/dropdown-menu";

import { ChevronRightIcon } from "@heroicons/react/20/solid";
import * as SolidIcons from "@heroicons/react/24/solid";
import * as OutlineIcons from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarItem as SidebarItemType } from "../constants";

// Map outline to solid based on the export name from Heroicons
const iconMap: Record<string, any> = {};
Object.keys(OutlineIcons).forEach((key) => {
  if ((SolidIcons as any)[key]) {
    iconMap[key] = (SolidIcons as any)[key];
  }
});

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

  // Get the icon to display (Solid if active, Otherwise Outline)
  const IconComponent = item.icon;

  // Find the key by reference comparison (100% reliable)
  const iconKey = Object.keys(OutlineIcons).find(
    (key) => (OutlineIcons as any)[key] === IconComponent
  );

  const SolidIcon = iconKey ? iconMap[iconKey] : null;
  const Icon = isActive && SolidIcon ? SolidIcon : IconComponent;

  // Render khi thu gọn
  if (isCollapsed) {
    if (item.items) {
      return (
        <SidebarMenuItem className="px-3">
          <DropdownMenuRoot>
            <DropdownMenuRootTrigger asChild>
              <SidebarMenuButton
                tooltip={item.title}
                isActive={isActive}
                className={cn(
                  "h-10 w-full justify-start rounded-md transition-colors px-2.5",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                )}
              >
                <Icon className="size-6 shrink-0" strokeWidth={2} />
              </SidebarMenuButton>
            </DropdownMenuRootTrigger>
            <DropdownMenuContentRoot side="right" align="start" className="min-w-[190px] rounded-lg ml-4 shadow-md">
              <div className="px-3 py-2 text-xs font-bold text-muted-foreground border-b uppercase mb-1">{item.title}</div>
              <div className="p-1">
                {item.items.map((subItem) => (
                  <DropdownMenuRootItem
                    key={subItem.title}
                    asChild
                    className={cn(
                      "my-0.5 cursor-pointer rounded-md focus:bg-primary/10 focus:text-primary px-3 py-2 text-sm",
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
      <SidebarMenuItem className="px-3">
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          isActive={isActive}
          className={cn(
            "h-10 w-full justify-start rounded-md transition-colors px-2.5",
            isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
        >
          <Link href={item.href}>
            <Icon className="size-6 shrink-0" strokeWidth={2} />
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  // Render khi mở rộng
  if (item.items) {
    return (
      <CollapsibleRoot asChild defaultOpen={isActive} className="group/collapsible">
        <SidebarMenuItem className="px-3">
          <CollapsibleTriggerRoot asChild>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              className={cn(
                "h-10 rounded-md px-2.5 transition-colors justify-start",
                isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <Icon className="size-6 shrink-0" strokeWidth={2} />
              <span className="truncate ml-3">{item.title}</span>
              <ChevronRightIcon
                className="text-muted-foreground/50 ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90"
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
                      "h-10 px-3 rounded-md transition-colors",
                      isSubItemActive(subItem.href) ? "text-primary font-medium bg-primary/5" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Link href={subItem.href} className="flex items-center gap-3">
                      <div className={cn("h-1 w-1 shrink-0 rounded-full", isSubItemActive(subItem.href) ? "bg-primary" : "bg-muted-foreground/30")} />
                      <span className="text-xs">{subItem.title}</span>
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
    <SidebarMenuItem className="px-3">
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn(
          "h-10 rounded-md px-2.5 transition-colors justify-start",
          isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
        )}
      >
        <Link href={item.href} className="flex items-center">
          <Icon className="size-6 shrink-0" strokeWidth={2} />
          <span className="truncate ml-3">{item.title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
