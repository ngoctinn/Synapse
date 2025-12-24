"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui";
import { LayoutDashboard, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import * as React from "react";

interface MobileUserSheetProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onLogout: () => void;
}

export function MobileUserSheet({ user, onLogout }: MobileUserSheetProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const defaultUser = {
    name: "Admin User",
    email: "admin@synapse.com",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Admin",
  };
  const currentUser = user || defaultUser;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="relative ml-auto mr-2 h-8 w-8 cursor-pointer rounded-full p-0 md:hidden"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>
              {currentUser.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-2xl px-6 pb-6 pt-2">
        <div className="flex flex-col gap-6">
          <SheetHeader className="pt-2 text-center">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="ring-primary/10 h-16 w-16 ring-4">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback>
                  {currentUser.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <SheetTitle className="text-base">
                  {currentUser.name}
                </SheetTitle>
                <p className="text-muted-foreground text-sm">
                  {currentUser.email}
                </p>
              </div>
            </div>
          </SheetHeader>

          <div className="flex flex-col gap-2">
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start"
              >
                <LayoutDashboard className="text-primary mr-2 h-5 w-5" />
                Dashboard
              </Button>
            </Link>
            <Link href="/settings" onClick={() => setIsOpen(false)}>
              <Button
                variant="outline"
                size="lg"
                className="w-full justify-start"
              >
                <Settings className="text-primary mr-2 h-5 w-5" />
                Cài đặt
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-destructive hover:text-destructive hover:bg-destructive/10 w-full justify-start"
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
            >
              <LogOut className="h-5 w-5" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
