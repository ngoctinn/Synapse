"use client"


import { Button } from "@/shared/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pb-12 pt-24 md:pb-20 md:pt-32 lg:py-40">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex max-w-[64rem] flex-col items-center gap-6 text-center mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
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
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
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
              <Button size="lg" className="h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                Bắt đầu miễn phí
              </Button>
            </Link>

          </motion.div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 opacity-50 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
      </div>
    </section>
  )
}

