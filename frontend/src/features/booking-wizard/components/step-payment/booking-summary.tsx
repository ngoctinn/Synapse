"use client";

import { useBookingStore } from "../../hooks/use-booking-store";
import { formatCurrency } from "@/shared/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Separator } from "@/shared/ui/separator";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const BookingSummary = () => {
  const { selectedServices, staffId, staffName, selectedDate, selectedSlot } = useBookingStore();

  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);

  // Helper to display staff name
  const displayStaffName = staffName || (staffId === 'any' ? 'Ngẫu nhiên' : 'Đã chọn');

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader>
        <CardTitle>Tóm tắt đặt lịch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Services */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">Dịch vụ</h4>
          {selectedServices.map((service) => (
            <div key={service.id} className="flex justify-between text-sm">
              <span>{service.name}</span>
              <span>{formatCurrency(service.price)}</span>
            </div>
          ))}
        </div>

        <Separator />

        {/* Staff & Location */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <User className="size-4 text-muted-foreground" />
            <span>KTV: {displayStaffName}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-muted-foreground" />
            <span>Tại: Spa Center</span>
          </div>
        </div>

        {/* Time */}
        {(selectedDate && selectedSlot) && (
          <div className="space-y-2 text-sm">
             <div className="flex items-center gap-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="capitalize">{format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}</span>
             </div>
             <div className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span>{selectedSlot.start_time} ({totalDuration} phút)</span>
             </div>
          </div>
        )}

        <Separator />

        {/* Total */}
        <div className="space-y-2">
          <div className="flex justify-between items-center font-bold text-lg">
            <span>Tổng cộng</span>
            <span className="text-primary">{formatCurrency(totalPrice)}</span>
          </div>
          <p className="text-[10px] text-muted-foreground text-center uppercase tracking-wider">
            Thanh toán tại quầy
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
