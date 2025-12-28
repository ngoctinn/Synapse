"use client";

import { LucideIcon, LucideProps } from "lucide-react";
import * as React from "react";
import { cn } from "@/shared/lib/utils";

interface IconProps extends LucideProps {
  icon: LucideIcon;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
}

const sizeMap = {
  xs: 12, // size-3
  sm: 14, // size-3.5
  md: 16, // size-4 (Default for most UI)
  lg: 20, // size-5
  xl: 24, // size-6
};

/**
 * Icon - Wrapper chuẩn cho Lucide icons giúp đồng nhất size và stroke-width.
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ icon: LucideIconComponent, size = "md", strokeWidth = 2, className, ...props }, ref) => {
    const iconSize = typeof size === "number" ? size : sizeMap[size];

    return (
      <LucideIconComponent
        ref={ref}
        size={iconSize}
        strokeWidth={strokeWidth}
        className={cn("shrink-0", className)}
        {...props}
      />
    );
  }
);

Icon.displayName = "Icon";
