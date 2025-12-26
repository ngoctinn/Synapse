"use client";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden py-16 md:py-24 lg:py-32"
    >
      <div className="container relative z-10 mx-auto px-4">
        <div className="animate-fade-in mx-auto mb-16 flex max-w-[64rem] flex-col items-center gap-6 text-center">
          <Badge variant="soft">
            🚀 Phiên bản Beta đã sẵn sàng
          </Badge>

          <h1 className="font-heading text-foreground text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Quản lý Spa chuyên nghiệp <br />
            <span className="text-gradient-premium">Đơn giản hóa vận hành</span>
          </h1>

          <p className="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
            Synapse giúp bạn quản lý lịch hẹn, khách hàng và nhân viên một cách
            hiệu quả. Tập trung vào trải nghiệm khách hàng, để công nghệ lo phần
            còn lại.
          </p>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="btn-hero">
                Bắt đầu miễn phí
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="btn-hero">
                Liên hệ tư vấn
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup Visualization */}
        <div className="glass-card animate-slide-up relative mx-auto max-w-5xl p-2 shadow-2xl ring-[1.5px] ring-white/10 lg:rounded-2xl lg:p-4">
          <div className="bg-background relative aspect-[16/9] overflow-hidden rounded-lg border shadow-inner">
            {/* Mock Header */}
            <div className="bg-muted/30 flex h-12 items-center gap-2 border-b px-4">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-400/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-400/80" />
                <div className="h-3 w-3 rounded-full bg-green-400/80" />
              </div>
              <div className="bg-muted ml-4 h-6 w-32 rounded-lg" />
            </div>
            {/* Mock Body */}
            <div className="flex h-full">
              {/* Mock Sidebar */}
              <div className="bg-muted/10 hidden w-16 space-y-3 border-r p-4 sm:block md:w-48">
                <div className="bg-muted/50 h-8 w-full rounded-lg" />
                <div className="bg-muted/50 h-8 w-3/4 rounded-lg" />
                <div className="bg-muted/50 h-8 w-5/6 rounded-lg" />
              </div>
              {/* Mock Content */}
              <div className="flex-1 space-y-4 p-6">
                <div className="flex gap-4">
                  <div className="bg-primary/5 border-primary/10 h-24 flex-1 rounded-lg border" />
                  <div className="h-24 flex-1 rounded-lg border border-purple-500/10 bg-purple-500/5" />
                  <div className="h-24 flex-1 rounded-lg border border-pink-500/10 bg-pink-500/5" />
                </div>
                <div className="bg-muted/20 border-muted h-64 rounded-lg border border-dashed" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="text-muted-foreground animate-fade-in absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="text-sm">Khám phá thêm</span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </div>

      {/* Simple Background - No heavy animations */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-full w-full max-w-7xl -translate-x-1/2 overflow-hidden">
        <div className="bg-blob left-[-10%] top-[-10%] h-[40rem] w-[40rem] bg-purple-500/20" />
        <div className="bg-blob bg-primary/20 right-[-10%] top-[-10%] h-[40rem] w-[40rem]" />
        <div className="bg-blob bottom-[-20%] left-[20%] h-[50rem] w-[50rem] bg-pink-500/20" />
      </div>
    </section>
  );
}
