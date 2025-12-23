"use client";

import { useBookingStore } from "../../hooks/use-booking-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Calendar, Clock, User, ClipboardList, Phone, Mail, MapPin } from "lucide-react";
import { formatCurrency } from "@/shared/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

export const SummaryStep = () => {
  const {
    selectedServices,
    staffName,
    staffId,
    selectedDate,
    selectedSlot,
    customerInfo
  } = useBookingStore();

  const totalPrice = selectedServices.reduce((acc, curr) => acc + curr.price, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center sm:text-left mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Kiểm tra thông tin</h2>
        <p className="text-muted-foreground mt-1">
          Vui lòng rà soát lại thông tin trước khi hoàn tất đặt lịch.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dịch vụ & Thời gian */}
        <div className="space-y-6">
          <Card className="border-primary/20 shadow-sm overflow-hidden">
            <CardHeader className="bg-primary/5 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList className="size-4 text-primary" />
                Dịch vụ đã chọn
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {selectedServices.map((service) => (
                <div key={service.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{service.name}</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(service.price)}
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t flex justify-between items-center font-bold text-primary">
                <span>Tổng cộng</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                Lịch hẹn
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Ngày thực hiện</p>
                  <p className="text-sm font-semibold">
                    {selectedDate ? format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi }) : "Chưa chọn"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Giờ hẹn</p>
                  <p className="text-sm font-semibold flex items-center gap-1.5">
                    <Clock className="size-3.5" />
                    {selectedSlot ? `${selectedSlot.start_time} - ${selectedSlot.end_time}` : "Chưa chọn"}
                  </p>
                </div>
              </div>
              <div className="space-y-1 pt-2 border-t border-dashed">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Nhân viên thực hiện</p>
                <div className="flex items-center gap-2">
                   <div className="size-6 rounded-full bg-primary/10 flex items-center justify-center">
                     <User className="size-3.5 text-primary" />
                   </div>
                   <span className="text-sm font-semibold">{staffName || "Hệ thống tự sắp xếp"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thông tin khách hàng */}
        <div className="space-y-6">
          <Card className="shadow-sm border-none bg-muted/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="size-4 text-primary" />
                Thông tin khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background border shadow-sm">
                    <User className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Họ và tên</p>
                    <p className="text-sm font-semibold">{customerInfo?.full_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background border shadow-sm">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-muted-foreground">Số điện thoại</p>
                    <p className="text-sm font-semibold">{customerInfo?.phone_number}</p>
                  </div>
                </div>
                {customerInfo?.email && (
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background border shadow-sm">
                      <Mail className="size-4" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-muted-foreground">Email</p>
                      <p className="text-sm font-semibold">{customerInfo.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {customerInfo?.notes && (
                <div className="mt-4 p-3 bg-background rounded-lg border text-sm italic text-muted-foreground">
                  &quot;{customerInfo.notes}&quot;
                </div>
              )}
            </CardContent>
          </Card>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900/30">
            <p className="text-xs text-blue-800 dark:text-blue-400 font-medium leading-relaxed">
              <strong>Thanh toán tại quầy:</strong> Lịch hẹn của bạn sẽ được giữ chỗ. Quý khách vui lòng thanh toán trực tiếp tại quầy lễ tân sau khi hoàn thành liệu trình.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900/30">
            <p className="text-xs text-amber-800 dark:text-amber-400 font-medium">
              Lưu ý: Bạn có thể thay đổi thông tin bằng cách nhấn nút quay lại. Sau khi xác nhận, lịch hẹn sẽ được ghi nhận vào hệ thống.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
