"use client"

import { Button } from "@/shared/ui/button"
import { LogOut, Menu, X } from "lucide-react"
import { HeaderAuthButtons } from "./auth-buttons"
import { HeaderNav } from "./nav-links"

interface MobileMenuTriggerProps {
  isOpen: boolean
  onToggle: () => void
}

export function MobileMenuTrigger({ isOpen, onToggle }: MobileMenuTriggerProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden rounded-full cursor-pointer"
      onClick={onToggle}
    >
      {isOpen ? (
        <X className="h-5 w-5" />
      ) : (
        <Menu className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle menu</span>
    </Button>
  )
}

interface MobileMenuOverlayProps {
  isOpen: boolean
  onClose: () => void
  isLoggedIn: boolean
  onLogout: () => void
}

export function MobileMenuOverlay({ isOpen, onClose, isLoggedIn, onLogout }: MobileMenuOverlayProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden pointer-events-auto"
        onClick={onClose}
      />

      {/* Menu Content */}
      <div className="absolute top-[calc(100%+0.5rem)] left-4 right-4 z-50 rounded-2xl border bg-background/95 p-6 shadow-lg backdrop-blur-md animate-in slide-in-from-top-2 fade-in duration-200 md:hidden pointer-events-auto">
        <div className="flex flex-col space-y-6 items-center text-center">
          <nav className="flex flex-col space-y-4 w-full items-center">
            <HeaderNav mobile onLinkClick={onClose} />
          </nav>
          <div className="border-t w-full pt-4 flex flex-col gap-3">
            {!isLoggedIn ? (
              <HeaderAuthButtons mobile onActionClick={onClose} />
            ) : (
               <Button
                variant="outline"
                className="w-full justify-center rounded-xl cursor-pointer h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => {
                  onLogout()
                  onClose()
                }}
               >
                  <LogOut className="mr-2 size-4" />
                  Đăng xuất
               </Button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

