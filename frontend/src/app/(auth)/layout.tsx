import { HeaderLogo } from "@/shared/components/layout";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <div className="hidden lg:flex w-1/2 relative bg-primary overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/40" />

        <div className="relative z-10 p-12 text-primary-foreground max-w-lg select-none">
          <div className="mb-8">
            <HeaderLogo variant="inverted" textClassName="text-3xl font-serif" />
          </div>

          <blockquote className="space-y-6">
            <p className="text-2xl font-serif leading-relaxed">
              &quot;Nâng tầm trải nghiệm quản lý Spa của bạn với sự tinh tế và hiệu quả tuyệt đối.&quot;
            </p>
            <footer className="text-sm opacity-80 font-sans">
              — Hệ thống quản lý Spa chuyên nghiệp
            </footer>
          </blockquote>
        </div>

        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative">
        <HeaderLogo className="lg:hidden absolute top-8 left-8" textClassName="text-xl font-serif inline-block" />

        <div className="w-full max-w-[400px] space-y-6 animate-fade-in">
          {children}
        </div>

        <div className="absolute bottom-6 text-xs text-muted-foreground text-center">
          © 2024 Synapse Spa CRM. All rights reserved.
        </div>
      </div>
    </div>
  );
}
