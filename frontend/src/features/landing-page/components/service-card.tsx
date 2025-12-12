"use client";

import { Service } from "@/features/services/types";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Clock, Tag } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

// Fallback image khi URL rỗng hoặc load thất bại
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1000";

interface ServiceCardProps {
  service: Service;
  onBook?: (serviceId: string) => void;
}

export function ServiceCard({ service, onBook }: ServiceCardProps) {
  const [imgSrc, setImgSrc] = useState(service.image_url || FALLBACK_IMAGE);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg surface-card text-card-foreground hover:shadow-xl hover:ring-1 hover:ring-primary/50 transition-all duration-300 hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={imgSrc}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />

        {/* Chips/Badges overlay */}
        <div className="absolute top-3 right-3 flex gap-2">
          {service.is_popular && (
            <Badge
              variant="warning"
              className="shadow-sm backdrop-blur-md border animate-pulse"
            >
              Phổ biến
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3">
          <Badge
            variant="glass"
            className="backdrop-blur-md bg-black/40 text-white border-white/20"
          >
            {service.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {service.name}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {service.description}
        </p>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <span>{service.duration} phút</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-primary text-base">
            <Tag className="h-4 w-4" />
            <span>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(service.price)}
            </span>
          </div>
        </div>

        <Button
          onClick={() => onBook?.(service.id)}
          className="w-full rounded-xl shadow-md hover:shadow-primary/25 bg-primary hover:bg-primary/90 transition-all font-semibold"
        >
          Đặt lịch ngay
        </Button>
      </div>
    </div>
  );
}

