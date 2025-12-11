import { cn } from "@/shared/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const skeletonVariants = cva(
  // Base: respects prefers-reduced-motion
  "bg-accent rounded-md motion-safe:animate-pulse",
  {
    variants: {
      variant: {
        default: "",
        text: "h-4", // Standard text height
        avatar: "rounded-full", // Circular for avatars
        rect: "", // Custom rectangle
      },
      size: {
        sm: "h-3",
        default: "h-4",
        lg: "h-6",
        xl: "h-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SkeletonProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof skeletonVariants> {}

/**
 * Skeleton component - Base loading placeholder
 *
 * Features:
 * - Respects prefers-reduced-motion (uses motion-safe:animate-pulse)
 * - aria-hidden="true" for screen reader accessibility
 * - Supports variants: default, text, avatar, rect
 * - Supports sizes: sm, default, lg, xl
 */
function Skeleton({ className, variant, size, ...props }: SkeletonProps) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn(skeletonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Skeleton, skeletonVariants }

