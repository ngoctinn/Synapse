"use client";

import { useReducedMotion } from "@/shared/hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { motion, Variants } from "framer-motion";
import { Calendar, Sparkles, User } from "lucide-react";

interface DashboardStatsProps {
  upcomingAppointments: number;
  activeTreatments: number;
  loyaltyPoints: number;
  membershipTier: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DashboardStats({
  upcomingAppointments,
  activeTreatments,
  loyaltyPoints,
  membershipTier,
}: DashboardStatsProps) {
  const prefersReducedMotion = useReducedMotion();

  // When reduced motion is preferred, disable animations
  const MotionContainer = prefersReducedMotion ? "div" : motion.div;
  const MotionItem = prefersReducedMotion ? "div" : motion.div;

  const containerProps = prefersReducedMotion
    ? {}
    : {
        variants: containerVariants,
        initial: "hidden" as const,
        animate: "show" as const,
      };

  const itemProps = prefersReducedMotion
    ? {}
    : {
        variants: itemVariants,
      };

  return (
    <MotionContainer
      {...containerProps}
      className="grid auto-rows-min gap-4 md:grid-cols-3"
    >
      <MotionItem {...itemProps}>
        <Card className="stats-card-premium group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="group-hover:text-primary text-sm font-medium transition-colors">
              Lịch hẹn sắp tới
            </CardTitle>
            <Calendar
              className="text-muted-foreground group-hover:text-primary size-4 transition-colors"
              aria-hidden="true"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments}</div>
            <p className="text-muted-foreground text-xs">
              buổi hẹn đang chờ bạn
            </p>
          </CardContent>
        </Card>
      </MotionItem>

      <MotionItem {...itemProps}>
        <Card className="stats-card-premium group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="group-hover:text-primary text-sm font-medium transition-colors">
              Liệu trình đang dùng
            </CardTitle>
            <Sparkles
              className="text-muted-foreground group-hover:text-primary size-4 transition-colors"
              aria-hidden="true"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeTreatments}</div>
            <p className="text-muted-foreground text-xs">
              gói dịch vụ đang kích hoạt
            </p>
          </CardContent>
        </Card>
      </MotionItem>

      <MotionItem {...itemProps}>
        <Card className="stats-card-premium group">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="group-hover:text-primary text-sm font-medium transition-colors">
              Điểm tích lũy
            </CardTitle>
            <User
              className="text-muted-foreground group-hover:text-primary size-4 transition-colors"
              aria-hidden="true"
            />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loyaltyPoints}</div>
            <p className="text-muted-foreground text-xs">
              điểm thưởng ({membershipTier})
            </p>
          </CardContent>
        </Card>
      </MotionItem>
    </MotionContainer>
  );
}
