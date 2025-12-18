"use client";

/**
 * MetricsCards - Hiển thị thống kê nhanh trên Dashboard
 *
 * 4 cards: Hôm nay, Chờ xác nhận, Tỷ lệ lấp đầy, Doanh thu dự kiến
 */

import {
    Calendar,
    Clock,
    DollarSign,
    TrendingUp,
    Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

import type { AppointmentMetrics } from "../../types";

// ============================================
// TYPES
// ============================================

interface MetricsCardsProps {
  metrics: AppointmentMetrics | null;
  isLoading?: boolean;
  className?: string;
}

interface MetricCardData {
  title: string;
  value: string | number;
  subValue?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

// ============================================
// NUMBER ANIMATION HOOK
// ============================================

function useAnimatedNumber(targetValue: number, duration: number = 500): number {
  const [displayValue, setDisplayValue] = useState(0);
  const startValueRef = useRef(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;
    const startValue = startValueRef.current;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + (targetValue - startValue) * easeOut);

      setDisplayValue(currentValue);
      startValueRef.current = currentValue; // Update ref to current value

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [targetValue, duration]);

  return displayValue;
}

// ============================================
// COMPONENT
// ============================================

export function MetricsCards({
  metrics,
  isLoading = false,
  className,
}: MetricsCardsProps) {
  // Animated values
  const animatedTotal = useAnimatedNumber(metrics?.todayTotal || 0);
  const animatedPending = useAnimatedNumber(metrics?.todayPending || 0);
  const animatedOccupancy = useAnimatedNumber(metrics?.occupancyRate || 0);
  const animatedRevenue = useAnimatedNumber(metrics?.estimatedRevenue || 0);

  // Format currency
  const formatCurrency = (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toLocaleString("vi-VN");
  };

  // Card data
  const cards: MetricCardData[] = [
    {
      title: "Lịch hẹn hôm nay",
      value: animatedTotal,
      subValue: `${metrics?.todayCompleted || 0} đã hoàn thành`,
      icon: <Calendar className="h-5 w-5" />,
      color: "text-primary",
    },
    {
      title: "Chờ xác nhận",
      value: animatedPending,
      subValue: "cần xử lý",
      icon: <Clock className="h-5 w-5" />,
      color: "text-warning",
    },
    {
      title: "Tỷ lệ lấp đầy",
      value: `${animatedOccupancy}%`,
      subValue: "capacity",
      icon: <Users className="h-5 w-5" />,
      trend: {
        value: 5,
        isPositive: true,
      },
      color: "text-success",
    },
    {
      title: "Doanh thu dự kiến",
      value: formatCurrency(animatedRevenue),
      subValue: "VNĐ",
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-info",
    },
  ];

  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-4", className)}>
      {cards.map((card) => (
        <Card
          key={card.title}
          className={cn(
            "transition-all duration-200 hover:shadow-md",
            isLoading && "animate-pulse"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={cn("p-2 rounded-lg bg-muted/50", card.color)}>
              {card.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold tabular-nums">
                {isLoading ? "—" : card.value}
              </span>
              {card.subValue && (
                <span className="text-sm text-muted-foreground">
                  {card.subValue}
                </span>
              )}
            </div>

            {/* Trend indicator */}
            {card.trend && !isLoading && (
              <div
                className={cn(
                  "flex items-center gap-1 mt-2 text-xs font-medium",
                  card.trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                <TrendingUp
                  className={cn(
                    "h-3 w-3",
                    !card.trend.isPositive && "rotate-180"
                  )}
                />
                <span>
                  {card.trend.isPositive ? "+" : "-"}
                  {card.trend.value}% so với hôm qua
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
