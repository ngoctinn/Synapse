"use client"

import { LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { cn } from "@/shared/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(true) // Mock auth state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  // Effect to simulate auth check (replace with actual auth hook later)
  React.useEffect(() => {
    // Check local storage or cookie if needed
  }, [])

  // Close mobile menu when route changes
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/features", label: "Tính năng" },
    { href: "/pricing", label: "Bảng giá" },
    { href: "/about", label: "Về chúng tôi" },
  ]

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center",
              isActive ? "text-primary" : "text-muted-foreground",
              mobile && "py-2 w-full justify-center"
            )}
          >
            {mobile && isActive && (
              <span className="mr-2 h-2 w-2 rounded-full bg-primary" />
            )}
            {item.label}
          </Link>
        )
      })}
    </>
  )

  return (
    <header className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-5xl px-4 transition-all duration-300">
      <div className="flex h-14 items-center justify-between rounded-full border bg-background/80 px-6 shadow-sm backdrop-blur-md">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary text-primary-foreground p-1 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
              </svg>
            </div>
            <span className="hidden font-bold sm:inline-block text-lg">
              Synapse
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/01.png" alt="@user" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Admin User</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      admin@synapse.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => setIsLoggedIn(false)}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-full cursor-pointer">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full cursor-pointer">
                  Đăng ký ngay
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay & Content */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop to close menu when clicking outside */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="absolute top-full left-4 right-4 mt-2 z-50 rounded-2xl border bg-background/95 p-6 shadow-lg backdrop-blur-md animate-in slide-in-from-top-2 fade-in duration-200 md:hidden">
            <div className="flex flex-col space-y-6 items-center text-center">
              <nav className="flex flex-col space-y-4 w-full items-center">
                <NavLinks mobile />
              </nav>
              <div className="border-t w-full pt-4 flex flex-col gap-3">
                {!isLoggedIn ? (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <Button variant="outline" className="w-full justify-center rounded-xl cursor-pointer">
                        Đăng nhập
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="w-full">
                      <Button className="w-full justify-center rounded-xl cursor-pointer">
                        Đăng ký ngay
                      </Button>
                    </Link>
                  </>
                ) : (
                   <Button variant="outline" className="w-full justify-center rounded-xl cursor-pointer" onClick={() => { setIsLoggedIn(false); setIsMobileMenuOpen(false); }}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                   </Button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  )
}
