import { Card } from "@/shared/ui/card";
import { Checkbox } from "@/shared/ui/checkbox";
import { cn } from "@/shared/lib/utils";
import { ServiceItem } from "../../types";
import { formatCurrency } from "@/shared/lib/utils";
import { Clock } from "lucide-react";
import Image from "next/image";

interface ServiceCardProps {
  service: ServiceItem;
  isSelected: boolean;
  onToggle: (service: ServiceItem) => void;
}

export const ServiceCard = ({ service, isSelected, onToggle }: ServiceCardProps) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-200 border-2 group",
        isSelected
          ? "border-primary bg-primary/5 shadow-md"
          : "border-transparent hover:border-muted-foreground/20 bg-card"
      )}
      onClick={() => onToggle(service)}
    >
      <div className="flex gap-4 p-4">
        {/* Image / Thumbnail */}
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
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
             <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
               {service.name.charAt(0)}
             </div>
           )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-semibold text-base truncate pr-6">{service.name}</h3>
            {service.description && (
              <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                {service.description}
              </p>
            )}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="size-4 mr-1" />
              <span>{service.duration} phút</span>
            </div>
            <span className="font-semibold text-primary">
              {formatCurrency(service.price)}
            </span>
          </div>
        </div>

        {/* Checkbox (Visual only, controlled by card click) */}
        <div className="absolute top-4 right-4">
          <Checkbox 
            checked={isSelected} 
            className={cn(
              "data-[state=checked]:bg-primary data-[state=checked]:border-primary",
              // Mobile: Always visible. Desktop: Hidden unless selected or hovered.
              !isSelected && "opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
            )}
          />
        </div>
      </div>
    </Card>
  );
};
