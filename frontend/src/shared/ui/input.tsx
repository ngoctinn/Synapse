import { cva, type VariantProps } from "class-variance-authority";
import { CircleXIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

const inputVariants = cva(
  "flex w-full min-w-0 rounded-lg border bg-transparent text-base transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-[1.5px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "border-input bg-background shadow-xs hover:border-primary/30 focus-visible:ring-ring/40 focus-visible:border-primary/50 dark:bg-input/30 aria-invalid:ring-destructive/10 aria-invalid:border-destructive/80 aria-invalid:hover:border-destructive aria-invalid:focus-visible:ring-destructive/50 aria-invalid:focus-visible:border-destructive",
      },
      size: {
        default: "h-10 px-3 py-2", // 40px (Regular)
        sm: "h-8 px-2 text-xs",    // 32px (Compact)
        lg: "h-12 px-4 text-lg",   // 48px (Large)
        xl: "h-14 px-6 text-xl",
        icon: "h-10 w-10 p-0 text-center",
      },
      isError: {
        true: "border-destructive/80 ring-destructive/10 dark:ring-destructive/20 focus-visible:ring-destructive/50 focus-visible:border-destructive hover:border-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      type,
      startContent,
      endContent,
      variant,
      size,
      isError,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn("relative flex w-full items-center", containerClassName)}
      >
        {startContent && (
          <div className="text-muted-foreground pointer-events-none absolute bottom-0 left-3 top-0 z-10 flex items-center justify-center">
            {startContent}
          </div>
        )}
        <input
          type={type}
          data-slot="input"
          aria-invalid={!!isError}
          className={cn(
            inputVariants({ variant, size, isError, className }),
            startContent && "pl-10",
            (endContent || isError) && "pr-10"
          )}
          ref={ref}
          suppressHydrationWarning
          {...props}
        />
        {(endContent || isError) && (
          <div className="text-muted-foreground pointer-events-none absolute bottom-0 right-3 top-0 z-10 flex items-center justify-center">
            {isError && !endContent ? (
              <CircleXIcon className="text-destructive size-5" />
            ) : (
              endContent
            )}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };

