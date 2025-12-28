import { cn } from "@/shared/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { HTMLAttributes, forwardRef } from "react";

import { SpacingProps, extractSpacingProps, getSpacingClasses } from "./utilities";

export interface BoxProps extends HTMLAttributes<HTMLDivElement>, SpacingProps {
  asChild?: boolean;
}

const Box = forwardRef<HTMLDivElement, BoxProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const { spacingProps, otherProps } = extractSpacingProps(props);
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(getSpacingClasses(spacingProps), className)}
        {...otherProps}
      />
    );
  }
);
Box.displayName = "Box";

export { Box };

