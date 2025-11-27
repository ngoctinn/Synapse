"use client"

import * as React from "react"
import { HeaderAuthButtons } from "./auth-buttons"
import { HeaderLogo } from "./logo"
import { MobileMenuOverlay, MobileMenuTrigger } from "./mobile-menu"
import { MobileUserSheet } from "./mobile-user-sheet"
import { HeaderNav } from "./nav-links"
import { HeaderUserDropdown } from "./user-dropdown"

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true) // Mock auth state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  // Effect to simulate auth check (replace with actual auth hook later)
  React.useEffect(() => {
    // Check local storage or cookie if needed
  }, [])

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

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-5xl px-4 transition-all duration-300">
      <div className="flex h-14 items-center justify-between rounded-full border bg-background/80 px-6 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-6">
          <HeaderLogo />
          <nav className="hidden md:flex items-center space-x-6">
            <HeaderNav />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="hidden md:block">
                <HeaderUserDropdown onLogout={handleLogout} />
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
