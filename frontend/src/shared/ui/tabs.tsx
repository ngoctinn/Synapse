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
        /** Mặc định - nền solid cho header pages */
        default: "bg-muted/50",
        /** Form tabs - nền đậm hơn cho forms */
        form: "bg-muted/60",
        /** Underline style - không có nền, dùng border-bottom */
        underline: "bg-transparent border-b rounded-none p-0 gap-1",
        /** Ghost - không có nền, chỉ cho inline navigation */
        ghost: "bg-transparent p-0 gap-1",
      },
      size: {
        /** Compact cho inline/popup (36px) */
        sm: "h-8",
        /** Default cho page headers (40px) */
        default: "h-9",
        /** Large cho form sections (44px) */
        lg: "h-10",
      },
      /** Chế độ responsive: auto-width hoặc full-width */
      fullWidth: {
        true: "w-full",
        false: "w-fit",
      },
    },
      defaultVariants: {
      variant: "default",
      size: "sm",
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
        /** Default - active có background */
        default: [
          "rounded-lg border border-transparent px-3 py-1.5",
          // Hover state
          "hover:text-foreground hover:bg-background/50",
          // Active state - nổi bật với shadow
          "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-border/50",
        ],
        /** Form - active có background, padding nhỏ hơn */
        form: [
          "rounded-lg px-3 py-1.5",
          "hover:text-foreground",
          "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        ],
        /** Underline - active có border-bottom */
        underline: [
          "rounded-none border-b-2 border-transparent px-4 py-2.5",
          "hover:text-foreground hover:border-border",
          "data-[state=active]:border-primary data-[state=active]:text-foreground",
        ],
        /** Ghost - minimal styling */
        ghost: [
          "rounded-lg px-3 py-1.5",
          "hover:text-foreground hover:bg-accent",
          "data-[state=active]:text-foreground data-[state=active]:font-semibold",
        ],
      },
      size: {
        sm: "text-xs min-w-[80px]",
        default: "text-sm min-w-[100px]",
        lg: "text-sm min-w-[120px]",
      },
      /** Flex behavior trong container */
      stretch: {
        true: "flex-1",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
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
// PRESET CLASSES (Backward compatibility với tabs-styles.ts)
// Sẽ deprecated trong tương lai - sử dụng variant props thay thế
// =============================================================================

/** @deprecated Sử dụng <TabsList variant="default" size="sm"> thay thế */
export const PAGE_TABS_LIST_CLASS =
  "h-9 bg-muted/50 p-1 w-full md:w-auto justify-start";

/** @deprecated Sử dụng <TabsTrigger variant="default" size="sm" stretch> thay thế */
export const PAGE_TABS_TRIGGER_CLASS =
  "data-[state=active]:bg-background data-[state=active]:shadow-md text-sm font-medium px-4 min-w-[100px] transition-all duration-200 flex-1 md:flex-none";

/** @deprecated Sử dụng <TabsList variant="form" size="lg" fullWidth gridCols={3}> thay thế */
export const FORM_TABS_LIST_CLASS =
  "grid w-full bg-muted/60 rounded-xl p-1 mb-6 h-11";

/** @deprecated Sử dụng <TabsTrigger variant="form"> thay thế */
export const FORM_TABS_TRIGGER_CLASS =
  "data-[state=active]:bg-background data-[state=active]:shadow-sm";

/** @deprecated Sử dụng <TabsList variant="default" size="default" fullWidth gridCols={2}> thay thế */
export const SHEET_TABS_LIST_CLASS =
  "grid w-full mb-6 bg-muted/50 rounded-lg p-1 h-9";

/** @deprecated Sử dụng <TabsTrigger variant="default"> thay thế */
export const SHEET_TABS_TRIGGER_CLASS =
  "data-[state=active]:bg-background data-[state=active]:shadow-sm text-sm font-medium transition-all duration-200";

/** @deprecated Sử dụng gridCols prop trên TabsList thay thế */
export function getFormTabsGridCols(count: 2 | 3 | 4 | 5): string {
  const gridMap: Record<number, string> = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
  };
  return gridMap[count] || "grid-cols-2";
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
  tabsTriggerVariants,
};
export type { TabsListProps, TabsTriggerProps };
