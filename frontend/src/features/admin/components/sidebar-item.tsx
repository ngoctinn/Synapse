"use client"

import { cn } from "@/shared/lib/utils"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/shared/ui/collapsible"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/shared/ui/sidebar"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SidebarItem as SidebarItemType } from "../constants"

interface SidebarItemProps {
  item: SidebarItemType
}

export function SidebarItem({ item }: SidebarItemProps) {
  const pathname = usePathname()
  const { state } = useSidebar()
  const Icon = item.icon
  // Helper: Exact match for leaf nodes, Prefix match for parent nodes
  const isActive = item.items
    ? pathname.startsWith(item.href)
    : pathname === item.href

  // Helper to check if a sub-item is active (Exact match)
  const isSubItemActive = (href: string) => pathname === href


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
                  "h-11 min-h-[44px] font-medium justify-center rounded-xl transition-all duration-200 ease-out",
                  "group-data-[collapsible=icon]:!size-11 group-data-[collapsible=icon]:!min-h-[44px]",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                  "active:scale-[0.98] active:bg-sidebar-accent/80",
                  "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:shadow-sm"
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
                  className="focus:bg-sidebar-accent focus:text-sidebar-accent-foreground cursor-pointer rounded-lg my-0.5"
                >
                  <Link href={subItem.href}>{subItem.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      )
    }


    return (
      <Collapsible
        asChild
        defaultOpen={isActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              isActive={isActive}
              className={cn(
                "h-11 min-h-[44px] font-medium rounded-xl transition-all duration-200 ease-out",
                "group-data-[collapsible=icon]:!size-11 group-data-[collapsible=icon]:!min-h-[44px]",
                "group-hover/menu-item:bg-sidebar-accent group-hover/menu-item:text-sidebar-accent-foreground",
                "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                "active:scale-[0.98] active:bg-sidebar-accent/80",
                "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold",
                "motion-safe:hover:translate-x-1"
              )}
            >
              <Icon className="size-5" />
              <span className="truncate">{item.title}</span>
              <ChevronRight className="ml-auto size-4 transition-transform duration-200 ease-out group-data-[state=open]/collapsible:rotate-90 text-sidebar-foreground/50 group-hover/menu-item:text-sidebar-foreground" aria-hidden="true" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub className="mr-0 ml-[1.15rem] translate-x-0 border-l border-sidebar-border px-0 py-1">
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isSubItemActive(subItem.href)}
                    className={cn(
                      "h-9 min-h-[36px] pl-9 rounded-lg transition-all duration-200 ease-out",
                      "hover:bg-transparent hover:text-primary",
                      "active:bg-transparent focus:bg-transparent",
                      "data-[active=true]:bg-transparent data-[active=true]:text-primary data-[active=true]:font-medium",
                      "relative overflow-visible",
                      // Tree branch line (vertical + curve)
                      "before:absolute before:left-[-1px] before:top-0 before:h-[calc(50%)] before:w-5",
                      "before:border-b before:border-l before:border-sidebar-border before:rounded-bl-md",
                      "data-[active=true]:before:border-primary",
                      // Active dot
                      "after:absolute after:left-[19px] after:top-1/2 after:-translate-y-1/2",
                      "after:h-1.5 after:w-1.5 after:rounded-full after:bg-primary",
                      "after:opacity-0 data-[active=true]:after:opacity-100"
                    )}
                  >
                    <Link href={subItem.href}>
                      <span className="truncate">{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }


  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.title}
        className={cn(
          "h-11 min-h-[44px] font-medium rounded-xl transition-all duration-200 ease-out",
          "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:!size-11 group-data-[collapsible=icon]:!min-h-[44px]",
          "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          "active:scale-[0.98] active:bg-sidebar-accent/80",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-semibold",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground motion-safe:hover:translate-x-1 group-data-[collapsible=icon]:hover:translate-x-0"
        )}
      >
        <Link href={item.href} className="flex items-center gap-3">
          <Icon className="size-5" />
          <span className="group-data-[collapsible=icon]:hidden truncate">
            {item.title}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
