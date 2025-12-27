import { cn } from "@/shared/lib/utils";
import React, { HTMLAttributes, forwardRef } from "react";

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: "default" | "muted" | "link" | "error" | "success" | "warning";
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  weight?: "normal" | "medium" | "semibold" | "bold" | "black";
}

const sizeClasses = {
  xs: "text-xs",        // 12px
  sm: "text-sm",        // 14px
  base: "text-base",    // 16px
  lg: "text-xl",        // 20px (Guiideline type-lg)
  xl: "text-2xl",       // 24px (Guideline type-xl)
};

const weightClasses = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  black: "font-black",
};

const variantClasses = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  link: "text-primary hover:underline cursor-pointer",
  error: "text-destructive",
  success: "text-emerald-500",
  warning: "text-amber-500",
};

const Text = forwardRef<HTMLParagraphElement, TextProps>(
  (
    {
      className,
      variant = "default",
      size = "base",
      weight = "normal",
      ...props
    },
    ref
  ) => {
    return (
      <p
        ref={ref}
        className={cn(
          sizeClasses[size],
          weightClasses[weight],
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  weight?: "normal" | "medium" | "semibold" | "bold" | "black";
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 2, weight = "bold", ...props }, ref) => {
    const Tag = `h${level}` as React.ElementType;
    const sizes = {
      1: "text-[32px] md:text-4xl", // 32px (type-xxl)
      2: "text-2xl",                // 24px (type-xl)
      3: "text-xl",                 // 20px (type-lg)
      4: "text-base",               // 16px (type-md)
      5: "text-sm",                 // 14px (type-sm)
      6: "text-xs",                 // 12px (type-xs)
    };

    return (
      <Tag
        ref={ref}
        className={cn(sizes[level], weightClasses[weight], "tracking-tight", className)}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

export { Heading, Text };

