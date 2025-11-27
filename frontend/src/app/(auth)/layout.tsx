import { Footer, Header } from "@/features/layout";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="min-h-screen flex flex-col bg-background p-4 pt-24">
        <div className="w-full max-w-md space-y-8 m-auto">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
