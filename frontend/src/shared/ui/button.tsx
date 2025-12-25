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
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-sm font-medium leading-none transition-all duration-200 focus-premium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 active:scale-95 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        soft: "bg-primary/10 text-primary hover:bg-primary/20",
        "ghost-destructive":
          "text-destructive hover:bg-destructive/10 hover:text-destructive",
        success:
          "bg-alert-success text-alert-success-foreground border-alert-success-border hover:bg-alert-success/90",
        warning:
          "bg-alert-warning text-alert-warning-foreground border-alert-warning-border hover:bg-alert-warning/90",
        "outline-success":
          "border-alert-success-border text-alert-success-foreground bg-transparent hover:bg-alert-success/10",
        "outline-warning":
          "border-alert-warning-border text-alert-warning-foreground bg-transparent hover:bg-alert-warning/10",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-9 w-9",
        "icon-xs": "h-8 w-8",
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
