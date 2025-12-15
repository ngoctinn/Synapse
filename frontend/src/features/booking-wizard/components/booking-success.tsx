"use client";

import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, CheckCircle2, Clock, MapPin, User } from "lucide-react";
import Link from "next/link";

interface BookingSuccessProps {
  bookingId?: string;
  bookingTime?: Date;
  serviceName?: string;
  staffName?: string;
  onBookAnother: () => void;
}

export const BookingSuccess = ({
  bookingId = "B-123456",
  bookingTime = new Date(),
  serviceName: _serviceName = "Gội đầu dưỡng sinh",
  staffName = "Nguyễn Văn A",
  onBookAnother
}: BookingSuccessProps) => {
  return (
    <div className="flex items-center justify-center p-4 animate-in fade-in-50 zoom-in-95 duration-500">
      <Card className="w-full max-w-md text-center border-green-200 shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-4 pb-2">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-2">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">Đặt lịch thành công!</CardTitle>
          <p className="text-muted-foreground">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Lịch hẹn của bạn đã được xác nhận.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/30 p-4 rounded-lg space-y-3 text-sm border border-border/50">
            <div className="flex justify-between items-center pb-2 border-b border-border/50">
              <span className="text-muted-foreground">Mã đặt lịch:</span>
              <span className="font-mono font-bold">{bookingId}</span>
            </div>

            <div className="flex items-center gap-3 text-left">
              <Calendar className="h-4 w-4 text-primary shrink-0" />
              <span className="font-medium">
                {format(bookingTime, "EEEE, dd/MM/yyyy", { locale: vi })}
              </span>
            </div>

            <div className="flex items-center gap-3 text-left">
              <Clock className="h-4 w-4 text-primary shrink-0" />
              <span className="font-medium">
                {format(bookingTime, "HH:mm")}
              </span>
            </div>

            <div className="flex items-center gap-3 text-left">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <span>Spa Center - Chi nhánh chính</span>
            </div>

            <div className="flex items-center gap-3 text-left">
              <User className="h-4 w-4 text-primary shrink-0" />
              <span>KTV: {staffName}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground italic">
            Một email xác nhận đã được gửi đến hộp thư của bạn.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/profile"
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            Xem chi tiết
          </Link>
          <Button className="w-full" onClick={onBookAnother}>
            Đặt lịch tiếp
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
