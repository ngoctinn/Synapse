"use client";

import { MOCK_SERVICES } from "@/features/services/model/mocks";
import { Badge } from "@/shared/ui/badge";
import { SearchX } from "lucide-react";
import { useMemo, useState } from "react";
import { ServiceCard } from "./service-card";
import { ServiceFilter } from "./service-filter";

export function ServicesSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");

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

  return (
    <section id="services" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="animate-fade-in mb-12 flex flex-col items-center text-center">
          <Badge variant="soft" className="mb-4">
            Dịch vụ của chúng tôi
          </Badge>
          <h2 className="font-heading mb-4 text-3xl font-bold tracking-tight md:text-5xl">
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
          <div className="text-muted-foreground bg-background mx-auto max-w-2xl rounded-2xl border border-dashed py-16 text-center">
            <SearchX className="text-muted-foreground/50 mx-auto mb-4 h-12 w-12" />
            <p className="font-medium">Không tìm thấy dịch vụ phù hợp</p>
            <p className="mt-2 text-sm">
              Thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
