"use client";

import { BookingDialog } from "@/features/customer-dashboard";
import { MOCK_SERVICES } from "@/features/services/data/mocks";
import { Service } from "@/features/services/types";
import { Badge } from "@/shared/ui/badge";
import { SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { ServiceCard } from "./service-card";
import { ServiceFilter } from "./service-filter";

export function ServicesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        MOCK_SERVICES.map((s) => s.category).filter((c): c is string => !!c)
      )
    );
  }, []);

  const filteredServices = useMemo(() => {
    return MOCK_SERVICES.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesCategory =
        category === "All" || service.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, category]);

  const handleBook = (id: string) => {
    const service = MOCK_SERVICES.find((s) => s.id === id);
    if (service) {
      setSelectedService(service);
    }
  };

  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12 animate-fade-in">
          <Badge variant="soft" className="mb-4">
            Dịch vụ của chúng tôi
          </Badge>
          <h2 className="font-heading text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Trải nghiệm thư giãn tuyệt đối
          </h2>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Khám phá các liệu trình chăm sóc sức khỏe và sắc đẹp được thiết kế
            riêng cho bạn.
          </p>
        </div>

        <ServiceFilter
          categories={categories}
          selectedCategory={category}
          onSelectCategory={setCategory}
          onSearch={setSearchQuery}
        />

        {filteredServices.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground bg-background rounded-2xl border border-dashed max-w-2xl mx-auto">
            <SearchX className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="font-medium">Không tìm thấy dịch vụ phù hợp</p>
            <p className="text-sm mt-2">
              Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={handleBook}
              />
            ))}
          </div>
        )}
      </div>

      <BookingDialog
        open={!!selectedService}
        onOpenChange={(open) => !open && setSelectedService(null)}
        service={selectedService || undefined}
      />
    </section>
  );
}
