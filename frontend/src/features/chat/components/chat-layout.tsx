import { cn } from "@/shared/lib/utils";
import React from "react";

interface ChatLayoutProps {
  children: React.ReactNode;
  className?: string;
  defaultLayout?: number[];
}

export function ChatLayout({ children, className }: ChatLayoutProps) {
  return (
    <div
      className={cn(
        "flex h-[calc(100vh-var(--header-height)-1rem)] w-full gap-2 md:h-[calc(100vh-var(--header-height)-2rem)] md:gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}
