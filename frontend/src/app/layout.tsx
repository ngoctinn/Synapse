import { Toaster } from "@/shared/ui/sonner";
import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Synapse - Quản lý Spa Thông minh",
  description: "Nền tảng quản lý vận hành và chăm sóc khách hàng chuyên biệt cho Spa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${beVietnamPro.variable} antialiased font-sans`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
