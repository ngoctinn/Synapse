import { HeaderLogo } from "@/shared/components/layout";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background flex min-h-screen w-full">
      <div className="bg-primary relative hidden w-1/2 items-center justify-center overflow-hidden lg:flex">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="from-primary/80 to-primary/40 absolute inset-0 bg-gradient-to-br" />

        <div className="text-primary-foreground relative z-10 max-w-lg select-none p-12">
          <div className="mb-8">
            <HeaderLogo
              variant="inverted"
              textClassName="text-3xl font-serif"
            />
          </div>

          <blockquote className="space-y-6">
            <p className="font-serif text-2xl leading-relaxed">
              &quot;Nâng tầm trải nghiệm quản lý Spa của bạn với sự tinh tế và
              hiệu quả tuyệt đối.&quot;
            </p>
            <footer className="font-sans text-sm opacity-80">
              — Hệ thống quản lý Spa chuyên nghiệp
            </footer>
          </blockquote>
        </div>

        <div className="bg-accent/20 absolute -bottom-24 -left-24 h-96 w-96 rounded-full blur-3xl" />
        <div className="bg-secondary/20 absolute -right-24 -top-24 h-96 w-96 rounded-full blur-3xl" />
      </div>

      <div className="bg-muted/50 relative flex flex-1 flex-col items-center justify-center p-4 sm:p-8 lg:p-12">
        <HeaderLogo
          className="absolute left-8 top-8 lg:hidden"
          textClassName="text-xl font-serif inline-block"
        />

        <div className="animate-slide-up surface-card w-full max-w-[448px] p-6 sm:p-10">
          {children}
        </div>

        <div className="text-muted-foreground absolute bottom-6 text-center text-xs">
          © 2024 Synapse Spa CRM. All rights reserved.
        </div>
      </div>
    </div>
  );
}
