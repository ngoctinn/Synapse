import * as React from "react";

import { cn } from "@/shared/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input data-[placeholder]:text-muted-foreground/60 [&_svg:not([class*='text-'])]:text-muted-foreground aria-invalid:ring-destructive/10 dark:aria-invalid:ring-destructive/20 aria-invalid:border-destructive/80 aria-invalid:hover:border-destructive aria-invalid:focus-visible:ring-destructive/50 aria-invalid:focus-visible:border-destructive dark:bg-input/30 dark:hover:bg-input/50 bg-background shadow-xs focus-visible:ring-[1.5px] focus-visible:ring-ring/40 focus-visible:outline-none relative flex w-full items-center justify-between gap-2 whitespace-nowrap rounded-lg border px-4 py-2 text-sm transition-[color,box-shadow] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-14 data-[size=icon]:h-14 data-[size=lg]:h-16 data-[size=sm]:h-9 hover:border-primary/30 data-[size=icon]:w-14 data-[size=icon]:p-0 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg:not([class*='size-'])]:size-5 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className
      )}
      {...props}
      suppressHydrationWarning
    />
  );
}

export { Textarea };
