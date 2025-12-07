import { HeaderLogo } from "@/shared/ui/branding/header-logo"
import { Skeleton } from "@/shared/ui/skeleton"
import { HeaderNav } from "./nav-links"

/**
 * Header Skeleton - Hiển thị trong khi đang fetch user profile
 * Chỉ skeleton phần avatar, các phần static (logo, nav) render bình thường
 */
export function HeaderSkeleton() {
  return (
    <header
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <div className="flex h-12 w-full max-w-4xl items-center justify-between rounded-full border border-white/20 bg-white/70 dark:bg-black/70 px-6 shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 pointer-events-auto">
        {/* Logo & Nav - Static, không cần skeleton */}
        <div className="flex items-center gap-6">
          <HeaderLogo />
          <nav className="hidden md:flex items-center space-x-1">
            <HeaderNav />
          </nav>
        </div>

        {/* Auth Section - Skeleton cho avatar */}
        <div className="flex items-center gap-4">
          {/* Desktop Avatar Skeleton */}
          <div className="hidden md:block">
            <Skeleton className="h-9 w-9 rounded-full" />
          </div>

          {/* Mobile Avatar Skeleton */}
          <Skeleton className="h-8 w-8 rounded-full md:hidden" />
        </div>
      </div>
    </header>
  )
}

/**
 * Skeleton nhỏ gọn chỉ cho phần Auth buttons
 */
export function HeaderAuthSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <div className="hidden md:block">
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  )
}
