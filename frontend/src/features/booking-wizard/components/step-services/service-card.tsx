import { Card } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { cn } from "@/shared/lib/utils";
import { ServiceItem } from "../../types";
import { formatCurrency, formatDuration } from "@/shared/lib/utils";
import { Clock } from "lucide-react";
import Image from "next/image";

interface ServiceCardProps {
  service: ServiceItem;
  isSelected: boolean;
  onToggle: (service: ServiceItem) => void;
}

export const ServiceCard = ({
  service,
  isSelected,
  onToggle,
}: ServiceCardProps) => {
  return (
    <Card
      className={cn(
        "group relative cursor-pointer overflow-hidden border-2 transition-all duration-300 active:scale-[0.99]",
        isSelected
          ? "border-primary bg-primary/5 ring-primary/20 shadow-lg ring-2 ring-offset-2"
          : "hover:border-muted-foreground/20 bg-card border-transparent hover:shadow-md"
      )}
      onClick={() => onToggle(service)}
    >
      <div className="flex gap-4 p-4">
        {/* Image / Thumbnail */}
        <div className="bg-muted relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg">
          {service.image_url ? (
            // Using simple img tag for prototype if next/image config is tricky,
            // but will use next/image here assuming domains are configured or will be.
            // Fallback to div color if url is empty
            <Image
              src={service.image_url}
              alt={service.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="bg-primary/10 text-primary flex h-full w-full items-center justify-center text-xl font-bold">
              {service.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div>
            <h3 className="line-clamp-2 pr-6 text-base font-semibold leading-tight">
              {service.name}
            </h3>
            {service.description && (
              <p className="text-muted-foreground mt-1.5 line-clamp-2 text-sm leading-relaxed">
                {service.description}
              </p>
            )}
          </div>

          <div className="mt-2 flex items-center justify-between">
            <div className="text-muted-foreground flex items-center text-sm">
              <Clock className="mr-1 size-3.5" />
              <span>{formatDuration(service.duration)}</span>
            </div>
            <span className="text-primary font-semibold">
              {formatCurrency(service.price)}
            </span>
          </div>
        </div>

        {/* Checkbox (Visual only, controlled by card click) */}
        <div className="absolute right-4 top-4">
          <Checkbox
            checked={isSelected}
            className={cn(
              "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
              // Mobile: Always visible. Desktop: Hidden unless selected or hovered.
              !isSelected &&
                "opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100"
            )}
          />
        </div>
      </div>
    </Card>
  );
};
