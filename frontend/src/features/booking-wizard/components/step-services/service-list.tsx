import { ServiceItem } from "../../types";
import { ServiceCard } from "./service-card";
// Removed unused hooks

interface ServiceListProps {
  services: ServiceItem[];
  selectedServiceIds: string[];
  onToggleService: (service: ServiceItem) => void;
  activeCategory: string;
}

export const ServiceList = ({
  services,
  selectedServiceIds,
  onToggleService,
  activeCategory: _activeCategory, // Prefixed logic for future filtering
}: ServiceListProps) => {
  // Use intersection observer to detect active category if we had single list scroll
  // For now, we filter list by active category or show all grouped?
  // Requirement says "Horizontal scroll tabs" -> usually implies filtering or scrolling to section.
  // Let's implement filtering for simplicity in MVP, or grouping if "All" is selected.

  // Implementation: Filter by active category

  return (
    <div className="space-y-4 px-4 pb-24 pt-4">
      {services.length === 0 ? (
        <div className="text-muted-foreground py-12 text-center">
          Không có dịch vụ nào trong danh mục này.
        </div>
      ) : (
        services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            isSelected={selectedServiceIds.includes(service.id)}
            onToggle={onToggleService}
          />
        ))
      )}
    </div>
  );
};
