import * as React from "react";

import { cn } from "@/shared/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input ring-offset-background placeholder:text-muted-foreground/60 focus-visible:ring-ring/40 focus-visible:border-primary/50 hover:border-primary/30 aria-invalid:ring-destructive/10 aria-invalid:border-destructive/80 aria-invalid:hover:border-destructive aria-invalid:focus-visible:ring-destructive/50 aria-invalid:focus-visible:border-destructive dark:bg-input/30 flex min-h-[80px] w-full rounded-lg border bg-transparent px-3 py-2 text-base shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-[1.5px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
