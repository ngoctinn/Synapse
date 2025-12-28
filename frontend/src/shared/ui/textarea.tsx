import * as React from "react";

import { cn } from "@/shared/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base shadow-sm ring-offset-background placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-[1.5px] focus-visible:ring-ring/40 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 hover:border-primary/30 transition-all duration-200 md:text-sm aria-invalid:ring-destructive/10 aria-invalid:border-destructive/80 aria-invalid:hover:border-destructive aria-invalid:focus-visible:ring-destructive/50 aria-invalid:focus-visible:border-destructive dark:bg-input/30",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
