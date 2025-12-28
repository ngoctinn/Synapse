import { cn } from "@/shared/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const groupVariants = cva("flex flex-row", {
  variants: {
    gap: {
      0: "gap-0",
      1: "gap-1",
      1.5: "gap-1.5",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      baseline: "items-baseline",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    wrap: {
      true: "flex-wrap",
      false: "flex-nowrap",
    },
    grow: {
      true: "[&>*]:flex-1",
      false: "",
    },
  },
  defaultVariants: {
    gap: 2,
    align: "center",
    justify: "start",
    wrap: false,
    grow: false,
  },
});

import {
  SpacingProps,
  extractSpacingProps,
  getSpacingClasses,
} from "./utilities";

export interface GroupProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof groupVariants>,
    SpacingProps {}

export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  ({ className, gap, align, justify, wrap, grow, ...props }, ref) => {
    const { spacingProps, otherProps } = extractSpacingProps(props);
    return (
      <div
        ref={ref}
        className={cn(
          groupVariants({ gap, align, justify, wrap, grow, className }),
          getSpacingClasses(spacingProps)
        )}
        {...otherProps}
      />
    );
  }
);

Group.displayName = "Group";
