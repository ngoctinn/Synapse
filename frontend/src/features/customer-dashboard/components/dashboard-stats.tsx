"use client"

import { useReducedMotion } from "@/shared/hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card"
import { motion, Variants } from "framer-motion"
import { Calendar, Sparkles, User } from "lucide-react"

interface DashboardStatsProps {
  upcomingAppointments: number
  activeTreatments: number
  loyaltyPoints: number
  membershipTier: string
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function DashboardStats({
  upcomingAppointments,
  activeTreatments,
  loyaltyPoints,
  membershipTier,
}: DashboardStatsProps) {
  const prefersReducedMotion = useReducedMotion()

  // When reduced motion is preferred, disable animations
  const MotionContainer = prefersReducedMotion ? "div" : motion.div
  const MotionItem = prefersReducedMotion ? "div" : motion.div

  const containerProps = prefersReducedMotion
    ? {}
    : {
        variants: containerVariants,
        initial: "hidden" as const,
        animate: "show" as const,
      }

  const itemProps = prefersReducedMotion
    ? {}
    : {
        variants: itemVariants,
      }

  return (
    <MotionContainer
      {...containerProps}
      className="grid auto-rows-min gap-4 md:grid-cols-3"
    >
      <MotionItem {...itemProps}>
        <Card className="relative overflow-hidden border border-white/20 shadow-lg bg-card/80 backdrop-blur-2xl ring-1 ring-black/5 dark:bg-card/30 dark:ring-white/10 hover:scale-[1.01] hover:shadow-xl transition-all duration-200 cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
              Lịch hẹn sắp tới
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              buổi hẹn đang chờ bạn
            </p>
          </CardContent>
        </Card>
      </MotionItem>

      <MotionItem {...itemProps}>
        <Card className="relative overflow-hidden border border-white/20 shadow-lg bg-card/80 backdrop-blur-2xl ring-1 ring-black/5 dark:bg-card/30 dark:ring-white/10 hover:scale-[1.01] hover:shadow-xl transition-all duration-200 cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
              Liệu trình đang dùng
            </CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTreatments}</div>
            <p className="text-xs text-muted-foreground">
              gói dịch vụ đang kích hoạt
            </p>
          </CardContent>
        </Card>
      </MotionItem>

      <MotionItem {...itemProps}>
        <Card className="relative overflow-hidden border border-white/20 shadow-lg bg-card/80 backdrop-blur-2xl ring-1 ring-black/5 dark:bg-card/30 dark:ring-white/10 hover:scale-[1.01] hover:shadow-xl transition-all duration-200 cursor-pointer group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">
              Điểm tích lũy
            </CardTitle>
            <User className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loyaltyPoints}</div>
            <p className="text-xs text-muted-foreground">
              điểm thưởng ({membershipTier})
            </p>
          </CardContent>
        </Card>
      </MotionItem>
    </MotionContainer>
  )
}
