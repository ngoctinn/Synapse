"use client"


import { Button } from "@/shared/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pb-12 pt-24 md:pb-20 md:pt-32 lg:py-40">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex max-w-[64rem] flex-col items-center gap-6 text-center mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary border border-primary/20 shadow-sm"
          >
            🚀 Phiên bản Beta đã sẵn sàng
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground"
          >
            Quản lý Spa chuyên nghiệp <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 animate-gradient-x">
              Đơn giản hóa vận hành
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          >
            Synapse giúp bạn quản lý lịch hẹn, khách hàng và nhân viên một cách hiệu quả.
            Tập trung vào trải nghiệm khách hàng, để công nghệ lo phần còn lại.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mt-4"
          >
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all hover:scale-105">
                Bắt đầu miễn phí
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="h-12 px-8 text-lg rounded-full border-2 hover:bg-muted transition-all">
                Liên hệ tư vấn
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Mockup Visualization */}
        <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 20 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-5xl rounded-xl border bg-background/50 p-2 shadow-2xl backdrop-blur-sm lg:rounded-2xl lg:p-4 ring-1 ring-white/10"
        >
            <div className="rounded-lg border bg-background overflow-hidden aspect-[16/9] relative shadow-inner">
                {/* Mock Header */}
                <div className="h-12 border-b bg-muted/30 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400/80" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                        <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    </div>
                    <div className="ml-4 h-6 w-32 bg-muted rounded-md" />
                </div>
                {/* Mock Body */}
                <div className="flex h-full">
                    {/* Mock Sidebar */}
                    <div className="w-16 md:w-48 border-r bg-muted/10 p-4 space-y-3 hidden sm:block">
                        <div className="h-8 bg-muted/50 rounded-md w-full" />
                        <div className="h-8 bg-muted/50 rounded-md w-3/4" />
                        <div className="h-8 bg-muted/50 rounded-md w-5/6" />
                    </div>
                    {/* Mock Content */}
                    <div className="flex-1 p-6 space-y-4 bg-dots-pattern">
                         <div className="flex gap-4">
                            <div className="h-24 flex-1 bg-primary/5 rounded-xl border border-primary/10" />
                            <div className="h-24 flex-1 bg-purple-500/5 rounded-xl border border-purple-500/10" />
                            <div className="h-24 flex-1 bg-pink-500/5 rounded-xl border border-pink-500/10" />
                         </div>
                         <div className="h-64 bg-muted/20 rounded-xl border border-dashed border-muted" />
                    </div>
                </div>
            </div>
             {/* Glow effect behind mockup */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur-2xl opacity-20 -z-10" />
        </motion.div>
      </div>

      {/* Improved Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-40 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-500/30 rounded-full blur-[120px] mix-blend-multiply animate-blob" />
        <div className="absolute top-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-primary/30 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50rem] h-[50rem] bg-pink-500/30 rounded-full blur-[120px] mix-blend-multiply animate-blob animation-delay-4000" />
      </div>
    </section>
  )
}

