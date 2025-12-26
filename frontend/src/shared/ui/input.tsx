import { CheckIcon, ChevronDownIcon, ChevronUpIcon, CircleXIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/shared/lib/utils";

const inputVariants = cva(
  "flex w-full min-w-0 rounded-lg border bg-transparent text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-[1.5px] disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-input bg-background shadow-xs hover:border-primary/30 focus-visible:ring-[1.5px] focus-visible:ring-ring/40 focus-visible:border-primary/50 dark:bg-input/30 aria-invalid:ring-destructive/10 aria-invalid:border-destructive/80 aria-invalid:hover:border-destructive aria-invalid:focus-visible:ring-destructive/50 aria-invalid:focus-visible:border-destructive",
        glass:
          "bg-background/60 backdrop-blur-xl border-white/10 shadow-none focus-visible:ring-[1.5px] focus-visible:ring-white/20",
        flat: "bg-secondary/50 border-transparent shadow-none hover:bg-secondary/80 focus-visible:ring-[1.5px] focus-visible:ring-ring/40 focus-visible:bg-background",
      },
      size: {
        sm: "h-10 px-3",
        md: "h-12 px-4",
        default: "h-14 px-4",
        lg: "h-16 px-6 text-lg",
        xl: "h-20 px-8 text-xl",
        icon: "h-12 w-12 p-0 text-center",
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
          <div className="text-muted-foreground pointer-events-none absolute right-3 top-0 bottom-0 z-10 flex items-center justify-center">
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
