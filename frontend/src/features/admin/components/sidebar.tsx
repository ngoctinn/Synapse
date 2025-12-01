"use client"

import { HeaderLogo } from "@/features/layout/components/header/logo"
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
} from "@/shared/ui/sidebar"
import { HelpCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { SIDEBAR_ITEMS } from "../constants"

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="border-none" {...props}>
      <SidebarHeader className="h-16 justify-center px-4 group-data-[collapsible=icon]:px-2">
        <div className="flex items-center w-full">
            <HeaderLogo
              className="w-full"
              textClassName="group-data-[collapsible=icon]:hidden transition-all duration-200"
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

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        size="lg"
                        className="font-medium transition-all duration-200 group-data-[collapsible=icon]:justify-center"
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
        <div className="flex items-center gap-2 px-2 py-2 text-sm font-medium text-slate-400 hover:text-slate-600 cursor-pointer transition-colors group-data-[collapsible=icon]:justify-center">
            <HelpCircle className="w-5 h-5" />
            <span className="group-data-[collapsible=icon]:hidden">Need Help?</span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
