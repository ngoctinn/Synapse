import { cn } from "@/shared/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { HTMLAttributes, forwardRef } from "react";

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cols?: number | string;
  gap?: number | string;
  asChild?: boolean;
}

const Grid = forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    const gridStyle = {
      ...style,
      ...(cols
        ? {
            gridTemplateColumns:
              typeof cols === "number"
                ? `repeat(${cols}, minmax(0, 1fr))`
                : cols,
          }
        : {}),
      ...(gap ? { gap: typeof gap === "number" ? `${gap * 0.25}rem` : gap } : {}),
    } as React.CSSProperties;

    return (
      <Comp
        ref={ref}
        style={gridStyle}
        className={cn("grid gap-4", className)}
        {...props}
      />
    );
  }
);
Grid.displayName = "Grid";

export { Grid };

