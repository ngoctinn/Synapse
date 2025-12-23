"use client";

import { Button } from "@/shared/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { HeaderAuthButtons } from "./auth-buttons";
import { HeaderNav } from "./nav-links";

interface MobileMenuTriggerProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function MobileMenuTrigger({
  isOpen,
  onToggle,
}: MobileMenuTriggerProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="cursor-pointer rounded-full md:hidden"
      onClick={onToggle}
    >
      {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
}

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export function MobileMenuOverlay({
  isOpen,
  onClose,
  isLoggedIn,
  onLogout,
}: MobileMenuOverlayProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop to close menu when clicking outside */}
      <div
        className="pointer-events-auto fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
        onClick={onClose}
      />

      {/* Menu Content */}
      <div className="bg-background/95 animate-in slide-in-from-top-2 fade-in pointer-events-auto absolute left-4 right-4 top-[calc(100%+0.5rem)] z-50 rounded-2xl border p-6 shadow-lg backdrop-blur-md duration-200 md:hidden">
        <div className="flex flex-col items-center space-y-6 text-center">
          <nav className="flex w-full flex-col items-center space-y-4">
            <HeaderNav mobile onLinkClick={onClose} />
          </nav>
          <div className="flex w-full flex-col gap-3 border-t pt-4">
            {!isLoggedIn ? (
              <HeaderAuthButtons mobile onActionClick={onClose} />
            ) : (
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-11 w-full cursor-pointer justify-center rounded-xl"
                onClick={() => {
                  onLogout();
                  onClose();
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
  );
}
