"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

// =============================================================================
// TABS ROOT
// =============================================================================

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

// =============================================================================
// TABS LIST - với variant và size hỗ trợ
// =============================================================================

const tabsListVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-lg p-1 text-muted-foreground",
  {
    variants: {
      variant: {
        /** Ghost - không có nền, chỉ cho inline navigation */
        ghost: "bg-transparent p-0 gap-1",
        /** Soft - style với nền nhẹ và active primary border */
        soft: "bg-muted/10 border border-border/40 p-1 gap-1 inline-flex items-center justify-center rounded-lg text-muted-foreground",
      },
      size: {
        /** Compact cho inline/popup (32px - matches Button sm) */
        sm: "h-8",
        /** Default cho page headers (40px - matches Button default) */
        default: "h-10",
        /** Large cho form sections (48px - matches Button lg) */
        lg: "h-12",
      },
      /** Chế độ responsive: auto-width hoặc full-width */
      fullWidth: {
        true: "w-full",
        false: "w-fit",
      },
    },
    defaultVariants: {
      variant: "soft",
      size: "default",
      fullWidth: false,
    },
  }
);

interface TabsListProps
  extends
    React.ComponentProps<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {
  /** Số cột grid (chỉ áp dụng khi fullWidth=true) */
  gridCols?: 2 | 3 | 4 | 5;
}

function TabsList({
  className,
  variant,
  size,
  fullWidth,
  gridCols,
  ...props
}: TabsListProps) {
  // Tạo grid class nếu fullWidth và có gridCols
  const gridClass = fullWidth && gridCols ? `grid grid-cols-${gridCols}` : "";

  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        tabsListVariants({ variant, size, fullWidth }),
        gridClass,
        className
      )}
      {...props}
    />
  );
}

// =============================================================================
// TABS TRIGGER - với variant tương ứng
// =============================================================================

const tabsTriggerVariants = cva(
  // Base styles - focus, disabled, icon handling
  [
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium transition-all duration-200 ease-out",
    // Focus states
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    // Disabled state
    "disabled:pointer-events-none disabled:opacity-50",
    // Icon sizing
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    // Cursor
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        /** Ghost - minimal styling */
        ghost: [
          "rounded-lg px-3 py-1.5",
          "hover:text-foreground hover:bg-accent",
          "data-[state=active]:text-foreground data-[state=active]:font-semibold",
        ],
        /** Soft - active giống Button soft variant */
        soft: [
          "rounded-lg px-3 py-1.5",
          "hover:text-foreground hover:bg-muted/50",
          "data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border data-[state=active]:border-primary/20 data-[state=active]:shadow-sm data-[state=active]:font-semibold",
        ],
      },
      size: {
        sm: "text-xs min-w-[80px]",
        default: "text-sm min-w-[100px]",
        lg: "text-base min-w-[120px]",
      },
      /** Flex behavior trong container */
      stretch: {
        true: "flex-1",
        false: "",
      },
    },
    defaultVariants: {
      variant: "soft",
      size: "default",
      stretch: false,
    },
  }
);

interface TabsTriggerProps
  extends
    React.ComponentProps<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

function TabsTrigger({
  className,
  variant,
  size,
  stretch,
  ...props
}: TabsTriggerProps) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(tabsTriggerVariants({ variant, size, stretch }), className)}
      {...props}
    />
  );
}

// =============================================================================
// TABS CONTENT
// =============================================================================

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "flex-1 outline-none",
        // Animation khi chuyển tab
        "data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-bottom-2 data-[state=active]:duration-300",
        className
      )}
      {...props}
    />
  );
}



// =============================================================================
// EXPORTS
// =============================================================================

export {
  Tabs,
  TabsContent,
  TabsList,
  tabsListVariants,
  TabsTrigger,
  tabsTriggerVariants
};
export type { TabsListProps, TabsTriggerProps };

