  "use client"

import { cn } from "@/shared/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export const NAV_ITEMS = [
  { href: "/#hero", label: "Trang chủ" },
  { href: "/#features", label: "Tính năng" },
  { href: "/#testimonials", label: "Khách hàng" },
  { href: "/#contact", label: "Liên hệ" },
]

interface HeaderNavProps {
  mobile?: boolean
  className?: string
  onLinkClick?: () => void
}

export function HeaderNav({ mobile = false, className, onLinkClick }: HeaderNavProps) {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string>("")

  useEffect(() => {
    if (pathname === "/") {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id)
            }
          })
        },
        {
          rootMargin: "-50% 0px -50% 0px", // Trigger when section is in middle of viewport
        }
      )

      const sections = document.querySelectorAll("section[id]")
      sections.forEach((section) => observer.observe(section))

      return () => {
        sections.forEach((section) => observer.unobserve(section))
      }
    }
  }, [pathname])

  return (
    <div className={cn("flex", mobile ? "flex-col space-y-4 w-full" : "items-center space-x-6", className)}>
      {NAV_ITEMS.map((item) => {
        // Check if item is active based on pathname OR hash
        const isHome = pathname === "/"
        const itemHash = item.href.split("#")[1]

        let isActive = false

        if (item.href === "/#hero" && isHome && !activeSection) {
             // Default to hero if no section active on home
             isActive = true
        } else if (isHome && itemHash) {
             // Match hash with active scroll section
             isActive = activeSection === itemHash
        } else {
             // Fallback to exact path match for non-hash links
             isActive = pathname === item.href
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onLinkClick}
            className={cn(
              "relative text-sm font-medium transition-colors duration-300 flex items-center px-3 py-2 rounded-full whitespace-nowrap",
              isActive
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:text-[var(--primary)]",
              mobile && "w-full justify-center text-base"
            )}
          >
            {isActive && (
              <span className="relative mr-2 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            )}
            <span>
              {item.label}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
