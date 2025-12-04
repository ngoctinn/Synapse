"use client"

import { HeaderLogo } from "@/shared/ui/branding/header-logo"
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
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    useSidebar,
} from "@/shared/ui/sidebar"
import { ChevronRight, HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SIDEBAR_ITEMS } from "../constants"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/20 bg-sidebar/90 backdrop-blur-md supports-[backdrop-filter]:bg-sidebar/80 shadow-sm"
      {...props}
    >
      <SidebarHeader className="h-16 justify-center px-4 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center w-full transition-all duration-300 ease-in-out">
            <HeaderLogo
              className="w-full"
              textClassName="group-data-[collapsible=icon]:hidden transition-all duration-300"
            />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 group-data-[collapsible=icon]:px-0">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                if (item.items) {
                  // Collapsed State: Dropdown Menu
                  if (state === "collapsed") {
                    return (
                      <SidebarMenuItem key={item.title}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                              tooltip={item.title}
                              isActive={isActive}
                              className="font-medium justify-center rounded-xl transition-all duration-300 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:shadow-sm"
                            >
                              <Icon className="size-5" />
                              <span className="sr-only">{item.title}</span>
                            </SidebarMenuButton>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="right" align="start" className="min-w-[180px] rounded-xl">
                            {item.items.map((subItem) => (
                              <DropdownMenuItem key={subItem.title} asChild className="focus:bg-primary/10 focus:text-primary cursor-pointer rounded-lg my-0.5">
                                <Link href={subItem.href}>
                                  {subItem.title}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    )
                  }

                  // Expanded State: Collapsible
                  return (
                    <Collapsible
                      key={item.title}
                      asChild
                      defaultOpen={isActive}
                      className="group/collapsible"
                    >
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={isActive}
                            className="font-medium rounded-xl transition-all duration-300 group-hover/menu-item:bg-sidebar-accent group-hover/menu-item:text-sidebar-accent-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold hover:translate-x-1"
                          >
                            <Icon className="size-5" />
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto size-4 transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90 text-muted-foreground/50 group-hover/menu-item:text-muted-foreground" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="mr-0 ml-3.5 border-l border-border/50 px-0 py-1">
                            {item.items.map((subItem) => {
                                const isSubActive = pathname === subItem.href
                                return (
                                    <SidebarMenuSubItem key={subItem.title}>
                                        <SidebarMenuSubButton
                                        asChild
                                        isActive={isSubActive}
                                        className="h-9 pl-4 rounded-md transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-primary data-[active=true]:font-medium relative overflow-visible
                                            before:absolute before:left-[-16px] before:top-1/2 before:-translate-y-1/2 before:h-px before:w-3.5 before:bg-border/50
                                            data-[active=true]:before:bg-primary data-[active=true]:before:h-0.5"
                                        >
                                        <Link href={subItem.href}>
                                            <span>{subItem.title}</span>
                                        </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                )
                            })}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  )
                }

                // Single Item
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className="font-medium rounded-xl transition-all duration-300 group-data-[collapsible=icon]:justify-center data-[active=true]:bg-primary/10 data-[active=true]:text-primary data-[active=true]:font-semibold hover:bg-sidebar-accent/80 hover:translate-x-1"
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <Icon className="size-5" />
                        <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Hỗ trợ"
              className="font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all duration-300 hover:translate-x-1 group-data-[collapsible=icon]:justify-center rounded-xl"
            >
              <HelpCircle className="size-5" />
              <span className="group-data-[collapsible=icon]:hidden">Hỗ trợ</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
