
"use client"

import { Service } from "@/features/services/types"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { motion } from "framer-motion"
import { Clock, Tag } from "lucide-react"
import Image from "next/image"

interface ServiceCardProps {
  service: Service
  onBook?: (serviceId: string) => void
}

export function ServiceCard({ service, onBook }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm hover:shadow-lg hover:ring-1 hover:ring-primary/20 transition-all dark:bg-card/40 dark:backdrop-blur-sm"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={service.image_url || ''}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

        {/* Chips/Badges overlay */}
        <div className="absolute top-3 right-3 flex gap-2">
          {service.is_popular && (
            <Badge variant="warning" className="shadow-sm backdrop-blur-sm border-0">
              Phổ biến
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3">
          <Badge variant="glass">
            {service.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex justify-between items-start gap-2 mb-2">
          <h3 className="font-serif text-lg font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
            {service.name}
          </h3>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
          {service.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" />
            <span>{service.duration} phút</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <Tag className="h-4 w-4 text-primary" />
            <span>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(service.price)}
            </span>
          </div>
        </div>

        <Button
          onClick={() => onBook?.(service.id)}
          className="w-full rounded-xl shadow-md hover:shadow-primary/25 bg-primary hover:bg-primary/90 transition-all"
        >
          Đặt lịch ngay
        </Button>
      </div>
    </motion.div>
  )
}
