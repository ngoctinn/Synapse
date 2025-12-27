import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import React from "react";

interface MobileNavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  isPrimary?: boolean;
}

export function MobileNavItem({
  href,
  icon: Icon,
  label,
  isActive,
  isPrimary,
}: MobileNavItemProps) {
  if (isPrimary) {
    return (
      <Link
        href={href}
        className="-mt-8 flex flex-col items-center justify-center"
      >
        <div className="bg-primary text-primary-foreground border-background flex size-14 items-center justify-center rounded-full border-4 shadow-lg">
          <Icon className="size-6" />
        </div>
        <span className="mt-1 text-[10px] font-medium">{label}</span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "flex flex-1 flex-col items-center justify-center py-1 transition-colors",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      <Icon className={cn("size-6", isActive && "fill-primary/10")} />
      <span className="mt-0.5 text-[10px] font-medium">{label}</span>
    </Link>
  );
}

export function MobileNavBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background/80 pb-safe fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur-lg md:hidden">
      <nav className="flex h-16 items-center justify-around px-2">
        {children}
      </nav>
    </div>
  );
}
