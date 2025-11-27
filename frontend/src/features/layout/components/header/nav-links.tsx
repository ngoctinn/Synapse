"use client"

import { cn } from "@/shared/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export const NAV_ITEMS = [
  { href: "/", label: "Trang chủ" },
  { href: "/features", label: "Tính năng" },
  { href: "/pricing", label: "Bảng giá" },
  { href: "/about", label: "Về chúng tôi" },
]

interface HeaderNavProps {
  mobile?: boolean
  className?: string
  onLinkClick?: () => void
}

export function HeaderNav({ mobile = false, className, onLinkClick }: HeaderNavProps) {
  const pathname = usePathname()

  return (
    <div className={cn("flex", mobile ? "flex-col space-y-4 w-full" : "items-center space-x-6", className)}>
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center",
              isActive ? "text-primary" : "text-muted-foreground",
              mobile && "py-2 w-full justify-center text-base"
            )}
          >
            {mobile && isActive && (
              <span className="mr-2 h-2 w-2 rounded-full bg-primary" />
            )}
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}
