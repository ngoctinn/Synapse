"use client"

import { logoutAction } from "@/features/auth/actions"
import * as React from "react"
import { HeaderAuthButtons } from "./auth-buttons"
import { HeaderLogo } from "./logo"
import { MobileMenuOverlay, MobileMenuTrigger } from "./mobile-menu"
import { MobileUserSheet } from "./mobile-user-sheet"
import { HeaderNav } from "./nav-links"
import { UserProfile } from "./types"
import { HeaderUserDropdown } from "./user-dropdown"

export { HeaderLogo } from "./logo"
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
      <div className="flex h-12 w-full max-w-4xl items-center justify-between rounded-full border bg-background/95 px-6 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/80 pointer-events-auto">
        <div className="flex items-center gap-6">
          <HeaderLogo />
          <nav className="hidden md:flex items-center space-x-5">
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
