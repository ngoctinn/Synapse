import { useEffect, useState, useMemo } from "react";
import { useBookingStore } from "../../hooks/use-booking-store";
import { getServicesForBooking } from "../../actions";
import { ServiceItem } from "../../types";
import { CategoryTabs } from "./category-tabs";
import { ServiceList } from "./service-list";
import { FloatingSummary } from "./floating-summary";
import { Loader2 } from "lucide-react";

export const ServicesStep = () => {
  const { 
    selectedServices, 
    addService, 
    removeService, 
    goToStep 
  } = useBookingStore();

  const [isLoading, setIsLoading] = useState(true);
  const [groupedServices, setGroupedServices] = useState<Record<string, ServiceItem[]>>({});
  const [activeCategory, setActiveCategory] = useState<string>("");

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      const res = await getServicesForBooking();
      if (res.status === "success" && res.data) {
        setGroupedServices(res.data);
        const categories = Object.keys(res.data);
        if (categories.length > 0) {
          setActiveCategory(categories[0]);
        }
      }
      setIsLoading(false);
    };

    fetchServices();
  }, []);

  const categories = useMemo(() => Object.keys(groupedServices), [groupedServices]);
  
  const currentServices = useMemo(() => {
    return activeCategory ? groupedServices[activeCategory] || [] : [];
  }, [activeCategory, groupedServices]);

  const handleToggleService = (service: ServiceItem) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      removeService(service.id);
    } else {
      addService(service);
    }
  };

  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);

  const handleNext = () => {
    if (selectedServices.length > 0) {
      goToStep(2);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-200px)]">
      <div className="px-4 pt-4 pb-2">
        <h2 className="text-2xl font-bold tracking-tight">Chọn dịch vụ</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Khám phá và chọn các liệu trình phù hợp với bạn
        </p>
      </div>

      <CategoryTabs 
        categories={categories} 
        activeCategory={activeCategory} 
        onSelectCategory={setActiveCategory} 
      />
      
      <ServiceList 
        services={currentServices}
        selectedServiceIds={selectedServices.map(s => s.id)}
        activeCategory={activeCategory}
        onToggleService={handleToggleService}
      />

      <FloatingSummary 
        totalCount={selectedServices.length}
        totalPrice={totalPrice}
        totalDuration={totalDuration}
        onNext={handleNext}
      />
    </div>
  );
};
