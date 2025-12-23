import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface DataTableEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function DataTableEmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: DataTableEmptyStateProps) {
  return (
    <div className={cn("empty-state-container", className)}>
      <div className="bg-primary/10 animate-in zoom-in mb-4 rounded-full p-4 duration-500">
        <Icon className="text-primary h-10 w-10" />
      </div>
      <h3 className="text-foreground text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground mb-6 mt-2 max-w-sm text-sm">
        {description}
      </p>
      {action}
    </div>
  );
}
