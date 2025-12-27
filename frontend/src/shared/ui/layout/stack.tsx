import { cn } from "@/shared/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { HTMLAttributes, forwardRef } from "react";

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  gap?: number | string;
  asChild?: boolean;
  align?: "start" | "center" | "end" | "stretch" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
}

const alignClasses = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
  baseline: "items-baseline",
};

const justifyClasses = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

const VStack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, asChild = false, align = "stretch", justify = "start", ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(
          "flex flex-col gap-2",
          alignClasses[align],
          justifyClasses[justify],
          className
        )}
        {...props}
      />
    );
  }
);
VStack.displayName = "VStack";

const HStack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, asChild = false, align = "center", justify = "start", ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        ref={ref}
        className={cn(
          "flex flex-row gap-2",
          alignClasses[align],
          justifyClasses[justify],
          className
        )}
        {...props}
      />
    );
  }
);
HStack.displayName = "HStack";

const Stack = VStack;

export { HStack, Stack, VStack };

