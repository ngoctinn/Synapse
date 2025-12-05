"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { motion } from "framer-motion"
import { Calendar, Sparkles, User } from "lucide-react"

interface DashboardStatsProps {
  upcomingAppointments: number
  activeTreatments: number
  loyaltyPoints: number
  membershipTier: string
}

export function DashboardStats({
  upcomingAppointments,
  activeTreatments,
  loyaltyPoints,
  membershipTier,
}: DashboardStatsProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid auto-rows-min gap-4 md:grid-cols-3"
    >
      <motion.div variants={item}>
        <Card className="relative overflow-hidden border border-white/20 shadow-lg bg-white/30 backdrop-blur-2xl ring-1 ring-black/5 dark:bg-zinc-900/30 dark:ring-white/10 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
              Lịch hẹn sắp tới
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              buổi hẹn đang chờ bạn
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="relative overflow-hidden border border-white/20 shadow-lg bg-white/30 backdrop-blur-2xl ring-1 ring-black/5 dark:bg-zinc-900/30 dark:ring-white/10 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
              Liệu trình đang dùng
            </CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTreatments}</div>
            <p className="text-xs text-muted-foreground">
              gói dịch vụ đang kích hoạt
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={item}>
        <Card className="relative overflow-hidden border border-white/20 shadow-lg bg-white/30 backdrop-blur-2xl ring-1 ring-black/5 dark:bg-zinc-900/30 dark:ring-white/10 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
              Điểm tích lũy
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loyaltyPoints}</div>
            <p className="text-xs text-muted-foreground">
              điểm thưởng ({membershipTier})
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
