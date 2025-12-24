import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

const inputVariants = cva(
  "flex w-full min-w-0 rounded-lg border bg-transparent text-base leading-none transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default:
          "border-input bg-background shadow-premium-sm hover:border-input hover:shadow-md focus-premium dark:bg-input/30",
        glass:
          "bg-background/60 backdrop-blur-xl border-white/10 shadow-none focus-premium",
        flat: "bg-secondary/50 border-transparent shadow-none hover:bg-secondary/80 focus-premium focus-visible:bg-background",
      },
      size: {
        sm: "h-8 px-3 py-1",
        default: "h-9 px-3 py-2",
        lg: "h-11 px-4",
        xl: "h-12 px-4 text-base",
        icon: "h-9 w-9 p-0 text-center",
      },
      isError: {
        true: "ring-destructive/20 border-destructive dark:ring-destructive/40 focus-visible:ring-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
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
          <div className="text-muted-foreground pointer-events-none absolute left-3 top-0 bottom-0 z-10 flex items-center justify-center">
            {startContent}
          </div>
        )}
        <input
          type={type}
          data-slot="input"
          className={cn(
            inputVariants({ variant, size, isError, className }),
            startContent && "pl-10",
            endContent && "pr-10"
          )}
          ref={ref}
          {...props}
        />
        {endContent && (
          <div className="text-muted-foreground pointer-events-none absolute right-3 top-0 bottom-0 z-10 flex items-center justify-center">
            {endContent}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input, inputVariants };
