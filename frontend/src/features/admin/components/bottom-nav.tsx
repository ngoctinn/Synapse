"use client";

import { MobileNavBar, MobileNavItem } from "@/shared/ui/navigation/mobile-nav-bar";
import { Calendar, ClipboardList, Home, PlusCircle, User } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { icon: Home, label: "Công việc", href: "/admin/workspace" },
  { icon: Calendar, label: "Lịch hẹn", href: "/admin/appointments" },
  { icon: PlusCircle, label: "Tạo mới", href: "/booking", primary: true },
  { icon: ClipboardList, label: "Liệu trình", href: "/admin/treatments" },
  { icon: User, label: "Cá nhân", href: "/admin/settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <MobileNavBar>
      {NAV_ITEMS.map((item) => (
        <MobileNavItem
          key={item.label}
          href={item.href}
          icon={item.icon}
          label={item.label}
          isPrimary={item.primary}
          isActive={pathname === item.href}
        />
      ))}
    </MobileNavBar>
  );
}
