"use client"

import { logoutAction } from "@/features/auth/actions"
import { HeaderLogo } from "@/shared/ui/branding/header-logo"
import * as React from "react"
import { HeaderAuthButtons } from "./auth-buttons"
import { MobileMenuOverlay, MobileMenuTrigger } from "./mobile-menu"
import { MobileUserSheet } from "./mobile-user-sheet"
import { HeaderNav } from "./nav-links"
import { UserProfile } from "./types"
import { HeaderUserDropdown } from "./user-dropdown"

export { HeaderLogo } from "@/shared/ui/branding/header-logo"
export { HeaderUserDropdown } from "./user-dropdown"

interface HeaderProps {
  userProfile: UserProfile | null
}

export function Header({ userProfile }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Close mobile menu when resizing to desktop
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = async () => {
    await logoutAction()
    setIsMobileMenuOpen(false)
  }

  const user = userProfile ? {
    name: userProfile.full_name || userProfile.email,
    email: userProfile.email,
    avatar: userProfile.avatar_url || undefined
  } : undefined

  const isLoggedIn = !!userProfile

  return (
    <header
      className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <div className="flex h-12 w-full max-w-4xl items-center justify-between rounded-full border border-white/20 bg-white/70 dark:bg-black/70 px-6 shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 pointer-events-auto transition-all duration-300 hover:shadow-xl hover:border-white/30">
        <div className="flex items-center gap-6">
          <HeaderLogo />
          <nav className="hidden md:flex items-center space-x-1">
            <HeaderNav />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn && user ? (
            <>
              <div className="hidden md:block">
                <HeaderUserDropdown user={user} onLogout={handleLogout} />
              </div>
              <MobileUserSheet onLogout={handleLogout} />
            </>
          ) : (
            <HeaderAuthButtons />
          )}

          <MobileMenuTrigger
            isOpen={isMobileMenuOpen}
            onToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          />
        </div>
      </div>

      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
    </header>
  )
}
