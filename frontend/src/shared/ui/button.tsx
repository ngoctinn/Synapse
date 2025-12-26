import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import * as React from "react";

import {
  type ButtonVariant,
  type ComponentSize,
} from "@/shared/lib/design-system.types";
import { cn } from "@/shared/lib/utils";

  const buttonVariants = cva(
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-sm font-medium leading-none transition-all duration-200 focus-premium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 active:scale-[0.98] cursor-pointer",
    {
      variants: {
        variant: {
          default:
            "bg-primary/80 text-primary-foreground border border-primary/80 shadow hover:bg-primary/90 active:bg-primary",
          destructive:
            "bg-destructive/80 text-destructive-foreground border border-destructive/80 shadow-sm hover:bg-destructive/90 active:bg-destructive",
          outline:
            "border border-primary/50 text-primary bg-background hover:bg-primary/8",
          secondary:
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground",
          link: "text-primary underline-offset-4 hover:underline",
          soft: "bg-primary/10 text-primary border border-primary/20 shadow-sm hover:bg-primary/20 hover:border-primary/30",
          "ghost-destructive":
            "text-destructive hover:bg-destructive/10 hover:text-destructive",
          success:
            "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 hover:bg-emerald-500/20 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-500 dark:hover:bg-emerald-500/30",
          warning:
            "bg-amber-500/10 text-amber-600 border border-amber-500/20 hover:bg-amber-500/20 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-500 dark:hover:bg-amber-500/30",
          "outline-success":
            "border border-emerald-500/50 text-emerald-600 bg-transparent hover:bg-emerald-500/10 dark:text-emerald-500 dark:border-emerald-500/30",
          "outline-warning":
            "border border-amber-500/50 text-amber-600 bg-transparent hover:bg-amber-500/10 dark:text-amber-500 dark:border-amber-500/30",
      },
      size: {
        default: "h-12 px-8 py-2",
        sm: "h-10 rounded-lg px-4",
        lg: "h-14 rounded-lg px-8",
        xl: "h-16 rounded-lg px-10 text-lg",
        icon: "h-12 w-12",
        "icon-sm": "h-10 w-10",
        "icon-xs": "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /** Trạng thái loading của button */
  isLoading?: boolean;
  /** Icon hoặc content hiển thị bên trái */
  startContent?: React.ReactNode;
  /** Icon hoặc content hiển thị bên phải */
  endContent?: React.ReactNode;
  /**
   * @deprecated Sử dụng `isLoading` thay thế
   */
  loading?: boolean;
  /**
   * @deprecated Sử dụng `startContent` thay thế
   */
  leftIcon?: React.ReactNode;
  /**
   * @deprecated Sử dụng `endContent` thay thế
   */
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      isLoading = false,
      loading = false,
      startContent,
      endContent,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const isRunning = isLoading || loading;

    // Backward compat: fallback to deprecated props if new ones not provided
    const leftContent = startContent ?? leftIcon;
    const rightContent = endContent ?? rightIcon;

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          suppressHydrationWarning
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isRunning || disabled}
        suppressHydrationWarning
        {...props}
      >
        {isRunning && <Loader2 className="animate-spin" />}
        {!isRunning && leftContent && (
          <span>{leftContent}</span>
        )}
        {children}
        {!isRunning && rightContent && (
          <span>{rightContent}</span>
        )}
      </Comp>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonVariant, ComponentSize };
