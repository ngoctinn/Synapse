"use client";

import { cn } from "@/shared/lib/utils";

interface AnimatedTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index: number;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedTableRow({
  index: _index,
  children,
  className,
  ...props
}: AnimatedTableRowProps) {
  return (
    <tr
      className={cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}
