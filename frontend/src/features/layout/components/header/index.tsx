"use client"

import { logoutAction } from "@/features/auth/actions"
import { createClient } from "@/shared/lib/supabase/client"
import * as React from "react"
import { HeaderAuthButtons } from "./auth-buttons"
import { HeaderLogo } from "./logo"
import { MobileMenuOverlay, MobileMenuTrigger } from "./mobile-menu"
import { MobileUserSheet } from "./mobile-user-sheet"
import { HeaderNav } from "./nav-links"
import { HeaderUserDropdown } from "./user-dropdown"

export { HeaderLogo } from "./logo"
export { HeaderUserDropdown } from "./user-dropdown"

interface UserProfile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  phone_number: string | null
  role: string
}

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  // Check auth state and fetch user profile
  React.useEffect(() => {
    const checkAuthAndFetchProfile = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()

        if (session?.access_token) {
          setIsLoggedIn(true)

          // Fetch user profile from Backend API
          const apiUrl = process.env.NEXT_PUBLIC_API_URL
          if (apiUrl) {
            const response = await fetch(`${apiUrl}/users/me`, {
              headers: {
                'Authorization': `Bearer ${session.access_token}`
              }
            })

            if (response.ok) {
              const profile = await response.json()
              setUserProfile(profile)
            }
          }
        } else {
          setIsLoggedIn(false)
          setUserProfile(null)
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setIsLoggedIn(false)
        setUserProfile(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetchProfile()

    // Subscribe to auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setIsLoggedIn(true)
        checkAuthAndFetchProfile()
      } else {
        setIsLoggedIn(false)
        setUserProfile(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
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

  const handleLogout = async () => {
    await logoutAction()
    setIsLoggedIn(false)
    setUserProfile(null)
    setIsMobileMenuOpen(false)
  }

  if (isLoading) {
    return (
      <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300 pointer-events-none">
        <div className="flex h-14 w-full max-w-5xl items-center justify-between rounded-full border bg-background/80 px-6 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/60 pointer-events-auto">
          <HeaderLogo />
        </div>
      </header>
    )
  }

  const user = userProfile ? {
    name: userProfile.full_name || userProfile.email,
    email: userProfile.email,
    avatar: userProfile.avatar_url || undefined
  } : undefined

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300 pointer-events-none">
      <div className="flex h-14 w-full max-w-5xl items-center justify-between rounded-full border bg-background/80 px-6 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/60 pointer-events-auto">
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
