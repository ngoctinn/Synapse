import { cn } from "@/shared/lib/utils";

interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
}

export function FilterBar({
  className,
  startContent,
  endContent,
  children,
  ...props
}: FilterBarProps) {
  return (
    <div
      className={cn("flex flex-1 items-center gap-2 md:flex-none", className)}
      {...props}
    >
      {startContent && (
        <div className="relative w-full md:w-[250px]">{startContent}</div>
      )}
      {children}
      {endContent}
    </div>
  );
}
