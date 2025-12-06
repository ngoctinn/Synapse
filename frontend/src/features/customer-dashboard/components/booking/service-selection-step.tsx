"use client";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { Clock, Sparkles } from "lucide-react";
import Image from "next/image";
import { BookingService } from "../../schemas/booking-schema";

interface ServiceSelectionStepProps {
  services: BookingService[];
  selectedServiceId: string;
  onSelect: (id: string) => void;
}

export function ServiceSelectionStep({
  services,
  selectedServiceId,
  onSelect,
}: ServiceSelectionStepProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}p` : `${hours} giờ`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-medium text-foreground/80">Chọn dịch vụ bạn muốn</h3>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((service) => {
          const isSelected = selectedServiceId === service.id;
          return (
            <Card
              key={service.id}
              className={cn(
                "cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-md group",
                isSelected
                  ? "ring-2 ring-primary border-primary shadow-md shadow-primary/10"
                  : "hover:border-primary/50"
              )}
              onClick={() => onSelect(service.id)}
            >
              <CardContent className="p-0">
                <div className="flex gap-3 p-3">
                  {/* Service Image */}
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-muted">
                    {service.image_url ? (
                      <Image
                        src={service.image_url}
                        alt={service.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <Sparkles className="h-6 w-6" />
                      </div>
                    )}
                    {isSelected && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          ✓
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Service Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                      <h4 className={cn(
                        "font-semibold text-sm leading-tight line-clamp-2 transition-colors",
                        isSelected ? "text-primary" : "group-hover:text-primary"
                      )}>
                        {service.name}
                      </h4>
                      {service.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          {service.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-2">
                      <Badge variant="secondary" className="text-xs font-normal gap-1 px-2">
                        <Clock className="h-3 w-3" />
                        {formatDuration(service.duration)}
                      </Badge>
                      <span className="font-bold text-sm text-primary">
                        {formatPrice(service.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
