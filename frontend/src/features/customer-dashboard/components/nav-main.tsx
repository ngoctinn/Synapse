"use client"

import { Calendar, Home, Sparkles, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/shared/ui/sidebar"

const items = [
  {
    title: "Tổng quan",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Lịch hẹn",
    url: "/dashboard/appointments",
    icon: Calendar,
  },
  {
    title: "Liệu trình",
    url: "/dashboard/treatments",
    icon: Sparkles,
  },
  {
    title: "Hồ sơ",
    url: "/dashboard/profile",
    icon: User,
  },
]

export function NavMain() {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Khách hàng</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
