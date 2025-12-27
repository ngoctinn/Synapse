import { cn } from "@/shared/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { HTMLAttributes, forwardRef } from "react";

export interface BoxProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return <Comp ref={ref} className={cn(className)} {...props} />;
  }
);
Box.displayName = "Box";

export { Box };
