import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import * as React from "react"

import {
  type ButtonVariant,
  type ComponentSize,
  warnDeprecated,
} from "@/shared/lib/design-system.types"
import { cn } from "@/shared/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 active:scale-[0.98] cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        soft: "bg-primary/10 text-primary hover:bg-primary/20 hover:shadow-sm",
        "ghost-destructive":
          "text-destructive hover:bg-destructive/10 hover:text-destructive",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  /** Trạng thái loading của button */
  isLoading?: boolean
  /** Icon hoặc content hiển thị bên trái */
  startContent?: React.ReactNode
  /** Icon hoặc content hiển thị bên phải */
  endContent?: React.ReactNode
  /**
   * @deprecated Sử dụng `isLoading` thay thế
   */
  loading?: boolean
  /**
   * @deprecated Sử dụng `startContent` thay thế
   */
  leftIcon?: React.ReactNode
  /**
   * @deprecated Sử dụng `endContent` thay thế
   */
  rightIcon?: React.ReactNode
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
    // Deprecation warnings
    if (loading) {
      warnDeprecated("Button", "loading", "isLoading")
    }
    if (leftIcon) {
      warnDeprecated("Button", "leftIcon", "startContent")
    }
    if (rightIcon) {
      warnDeprecated("Button", "rightIcon", "endContent")
    }

    const Comp = asChild ? Slot : "button"
    const isRunning = isLoading || loading

    // Backward compat: fallback to deprecated props if new ones not provided
    const leftContent = startContent ?? leftIcon
    const rightContent = endContent ?? rightIcon

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isRunning || disabled}
        {...props}
      >
        {isRunning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {!isRunning && leftContent && <span className="mr-1">{leftContent}</span>}
        {children}
        {!isRunning && rightContent && <span className="ml-1">{rightContent}</span>}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonVariant, ComponentSize }

