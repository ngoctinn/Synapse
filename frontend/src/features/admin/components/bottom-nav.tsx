"use client";

import { cn } from "@/shared/lib/utils";
import { Home, Calendar, ClipboardList, User, PlusCircle } from "lucide-react";
import Link from "next/link";
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
    <div className="bg-background/80 pb-safe fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-lg md:hidden">
      <nav className="flex h-16 items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.primary) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="-mt-8 flex flex-col items-center justify-center"
              >
                <div className="bg-primary text-primary-foreground border-background flex size-14 items-center justify-center rounded-full border-4 shadow-lg">
                  <Icon className="size-6" />
                </div>
                <span className="mt-1 text-[10px] font-medium">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-1 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className={cn("size-6", isActive && "fill-primary/10")} />
              <span className="mt-0.5 text-[10px] font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
