
"use client"

import { BookingDialog } from "@/features/customer-dashboard"; // Import BookingDialog
import { MOCK_SERVICES } from "@/features/services/data/mocks";
import { Service } from "@/features/services/types";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ServiceCard } from "./service-card";
import { ServiceFilter } from "./service-filter";

export function ServicesSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [selectedService, setSelectedService] = useState<Service | null>(null) // Add state for selected service
  const router = useRouter()

  const categories = useMemo(() => {
    return Array.from(new Set(MOCK_SERVICES.map(s => s.category).filter((c): c is string => !!c)))
  }, [])

  const filteredServices = useMemo(() => {
    return MOCK_SERVICES.filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (service.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = category === "All" || service.category === category

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, category])

  const handleBook = (id: string) => {
    const service = MOCK_SERVICES.find(s => s.id === id)
    if (service) {
      setSelectedService(service)
    }
  }

  return (
    <section id="services" className="py-10 md:py-14">
        <div className="container mx-auto px-4">
            <div className="flex flex-col items-center text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4"
                >
                    Dịch vụ của chúng tôi
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    viewport={{ once: true }}
                    className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-4"
                >
                    Trải nghiệm thư giãn tuyệt đối
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    viewport={{ once: true }}
                    className="text-muted-foreground max-w-2xl text-lg"
                >
                    Khám phá các liệu trình chăm sóc sức khỏe và sắc đẹp được thiết kế riêng cho bạn.
                </motion.p>
            </div>

            <ServiceFilter
                categories={categories}
                selectedCategory={category}
                onSelectCategory={setCategory}
                onSearch={setSearchQuery}
            />

            {filteredServices.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-background rounded-2xl border border-dashed max-w-2xl mx-auto">
                    <p>Không tìm thấy dịch vụ phù hợp.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredServices.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onBook={handleBook}
                        />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>

         <BookingDialog
            open={!!selectedService}
            onOpenChange={(open) => !open && setSelectedService(null)}
            service={selectedService || undefined}
        />
    </section>
  )
}
