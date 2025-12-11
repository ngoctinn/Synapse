"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar"
import { Button } from "@/shared/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/shared/ui/sheet"
import { LayoutDashboard, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import * as React from "react"

interface MobileUserSheetProps {
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onLogout: () => void
}

export function MobileUserSheet({ user, onLogout }: MobileUserSheetProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const defaultUser = {
    name: "Admin User",
    email: "admin@synapse.com",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Admin"
  }
  const currentUser = user || defaultUser

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="md:hidden relative h-8 w-8 rounded-full cursor-pointer p-0 ml-auto mr-2"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl px-6 pb-6 pt-2">
        <div className="flex flex-col gap-6">
          <SheetHeader className="text-center pt-2">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="h-16 w-16 ring-4 ring-primary/10">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <SheetTitle className="text-base">{currentUser.name}</SheetTitle>
                <p className="text-sm text-muted-foreground">
                  {currentUser.email}
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex flex-col gap-2">
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <Button variant="outline" size="lg" className="w-full justify-start">
                <LayoutDashboard className="mr-2 h-5 w-5 text-primary" />
                Dashboard
              </Button>
            </Link>
            <Link href="/settings" onClick={() => setIsOpen(false)}>
              <Button variant="outline" size="lg" className="w-full justify-start">
                <Settings className="mr-2 h-5 w-5 text-primary" />
                Cài đặt
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                onLogout()
                setIsOpen(false)
              }}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
