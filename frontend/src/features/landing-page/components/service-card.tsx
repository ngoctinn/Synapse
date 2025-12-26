"use client";

import { Service } from "@/features/services";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Calendar, Clock, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

// Fallback image khi URL rỗng hoặc load thất bại
const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=1000";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const [imgSrc, setImgSrc] = useState(service.image_url || FALLBACK_IMAGE);
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <div className="surface-card text-card-foreground hover:ring-primary/50 group relative flex flex-col overflow-hidden rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-[1.5px]">
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
        <div className="absolute right-3 top-3 flex gap-2">
          {service.is_popular && (
            <Badge
              variant="warning"
              className="animate-pulse border shadow-sm backdrop-blur-md"
            >
              Phổ biến
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3">
          <Badge
            variant="glass"
            className="border-white/20 bg-black/40 text-white backdrop-blur-md"
          >
            {service.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="group-hover:text-primary line-clamp-2 text-lg font-bold leading-tight transition-colors">
            {service.name}
          </h3>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-3 flex-1 text-sm">
          {service.description}
        </p>

        <div className="text-muted-foreground border-border/50 mb-4 flex items-center justify-between border-t pt-4 text-sm">
          <div className="flex items-center gap-1.5">
            <Clock className="text-primary size-4" />
            <span>{service.duration} phút</span>
          </div>
          <div className="text-primary flex items-center gap-1.5 text-base font-bold">
            <Tag className="size-4" />
            <span>
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(service.price)}
            </span>
          </div>
        </div>

        <Button
          asChild
          className="w-full rounded-lg shadow-md transition-transform duration-200 group-hover:scale-[1.02]"
        >
          <Link href="/booking">
            <Calendar className="size-4" />
            Đặt lịch ngay
          </Link>
        </Button>
      </div>
    </div>
  );
}
