import { cn } from "@/shared/lib/utils";
import { HStack } from "@/shared/ui/layout/stack";
import { LucideIcon } from "lucide-react";
import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "primary" | "secondary" | "accent" | "success" | "warning" | "info" | "purple";
  className?: string;
  description?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
}

export function StatCard({
  title,
  value,
  icon: Icon,
  variant = "default",
  className,
  description,
  trend,
}: StatCardProps) {
  const variantStyles = {
    default: "bg-card border-border",
    primary: "bg-primary/5 border-primary/10",
    secondary: "bg-secondary/5 border-secondary/10",
    accent: "bg-blue-500/5 border-blue-500/10",
    info: "bg-blue-500/5 border-blue-500/10",
    success: "bg-emerald-500/5 border-emerald-500/10",
    warning: "bg-amber-500/5 border-amber-500/10",
    purple: "bg-purple-500/5 border-purple-500/10",
  };

  const textStyles = {
    default: "text-muted-foreground",
    primary: "text-primary/60",
    secondary: "text-secondary/60",
    accent: "text-blue-500/60",
    info: "text-blue-500/60",
    success: "text-emerald-500/60",
    warning: "text-amber-500/60",
    purple: "text-purple-500/60",
  };

  const iconStyles = {
    default: "text-muted-foreground",
    primary: "text-amber-500",
    secondary: "text-secondary-foreground",
    accent: "text-blue-500",
    info: "text-blue-500",
    success: "text-emerald-500",
    warning: "text-amber-500",
    purple: "text-purple-500",
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-1 rounded-lg border p-3 transition-all duration-300 hover:shadow-md",
        variantStyles[variant],
        className
      )}
    >
      <HStack justify="between" align="start">
        <span
          className={cn(
            "text-[10px] font-bold uppercase",
            textStyles[variant]
          )}
        >
          {title}
        </span>
        <div className={cn("rounded-lg p-1.5 bg-background/50", iconStyles[variant])}>
           <Icon className="size-4" />
        </div>
      </HStack>

      <div className="mt-2">
         <span className="text-2xl font-black">{value}</span>
         {description && (
            <div className="text-muted-foreground mt-1 flex items-center text-xs gap-1">
              {description}
            </div>
         )}
      </div>
    </div>
  );
}
