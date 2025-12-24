"use client";

import { useBookingStore } from "../../hooks/use-booking-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import {
  Calendar,
  Clock,
  User,
  ClipboardList,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
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
    customerInfo,
  } = useBookingStore();

  const totalPrice = selectedServices.reduce(
    (acc, curr) => acc + curr.price,
    0
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-6 duration-500">
      <div className="mb-6 text-center sm:text-left">
        <h2 className="text-2xl font-bold tracking-tight">
          Kiểm tra thông tin
        </h2>
        <p className="text-muted-foreground mt-1">
          Vui lòng rà soát lại thông tin trước khi hoàn tất đặt lịch.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Dịch vụ & Thời gian */}
        <div className="space-y-6">
          <Card className="border-primary/20 overflow-hidden shadow-sm">
            <CardHeader className="bg-primary/5 pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ClipboardList className="text-primary size-4" />
                Dịch vụ đã chọn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium">{service.name}</span>
                  <span className="text-muted-foreground">
                    {formatCurrency(service.price)}
                  </span>
                </div>
              ))}
              <div className="text-primary flex items-center justify-between border-t pt-3 font-bold">
                <span>Tổng cộng</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Calendar className="text-primary size-4" />
                Lịch hẹn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                    Ngày thực hiện
                  </p>
                  <p className="text-sm font-semibold">
                    {selectedDate
                      ? format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })
                      : "Chưa chọn"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                    Giờ hẹn
                  </p>
                  <p className="flex items-center gap-1.5 text-sm font-semibold">
                    <Clock className="size-3.5" />
                    {selectedSlot
                      ? `${selectedSlot.start_time} - ${selectedSlot.end_time}`
                      : "Chưa chọn"}
                  </p>
                </div>
              </div>
              <div className="space-y-1 border-t border-dashed pt-2">
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
                  Nhân viên thực hiện
                </p>
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 flex size-6 items-center justify-center rounded-full">
                    <User className="text-primary size-3.5" />
                  </div>
                  <span className="text-sm font-semibold">
                    {staffName || "Hệ thống tự sắp xếp"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Thông tin khách hàng */}
        <div className="space-y-6">
          <Card className="bg-muted/50 border-none shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="text-primary size-4" />
                Thông tin khách hàng
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="bg-background rounded-lg border p-2 shadow-sm">
                    <User className="size-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase">
                      Họ và tên
                    </p>
                    <p className="text-sm font-semibold">
                      {customerInfo?.full_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-background rounded-lg border p-2 shadow-sm">
                    <Phone className="size-4" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase">
                      Số điện thoại
                    </p>
                    <p className="text-sm font-semibold">
                      {customerInfo?.phone_number}
                    </p>
                  </div>
                </div>
                {customerInfo?.email && (
                  <div className="flex items-center gap-3">
                    <div className="bg-background rounded-lg border p-2 shadow-sm">
                      <Mail className="size-4" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-[10px] font-bold uppercase">
                        Email
                      </p>
                      <p className="text-sm font-semibold">
                        {customerInfo.email}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {customerInfo?.notes && (
                <div className="bg-background text-muted-foreground mt-4 rounded-lg border p-3 text-sm italic">
                  &quot;{customerInfo.notes}&quot;
                </div>
              )}
            </CardContent>
          </Card>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-950/20">
            <p className="text-xs font-medium leading-relaxed text-blue-800 dark:text-blue-400">
              <strong>Thanh toán tại quầy:</strong> Lịch hẹn của bạn sẽ được giữ
              chỗ. Quý khách vui lòng thanh toán trực tiếp tại quầy lễ tân sau
              khi hoàn thành liệu trình.
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-950/20">
            <p className="text-xs font-medium text-amber-800 dark:text-amber-400">
              Lưu ý: Bạn có thể thay đổi thông tin bằng cách nhấn nút quay lại.
              Sau khi xác nhận, lịch hẹn sẽ được ghi nhận vào hệ thống.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
