"use client";

import { cn } from "@/shared/lib/utils";
import { Button, buttonVariants } from "@/shared/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
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
  onBookAnother,
}: BookingSuccessProps) => {
  return (
    <div className="animate-in fade-in zoom-in-95 flex items-center justify-center p-4 duration-500">
      <Card className="w-full max-w-md border-green-200 text-center shadow-lg">
        <CardHeader className="flex flex-col items-center space-y-4 pb-2">
          <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Đặt lịch thành công!
          </CardTitle>
          <p className="text-muted-foreground">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Lịch hẹn của bạn đã
            được xác nhận.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/30 border-border/50 space-y-3 rounded-lg border p-4 text-sm">
            <div className="border-border/50 flex items-center justify-between border-b pb-2">
              <span className="text-muted-foreground">Mã đặt lịch:</span>
              <span className="font-mono font-bold">{bookingId}</span>
            </div>

            <div className="flex items-center gap-3 text-left">
              <Calendar className="text-primary h-4 w-4 shrink-0" />
              <span className="font-medium">
                {format(bookingTime, "EEEE, dd/MM/yyyy", { locale: vi })}
              </span>
            </div>

            <div className="flex items-center gap-3 text-left">
              <Clock className="text-primary h-4 w-4 shrink-0" />
              <span className="font-medium">
                {format(bookingTime, "HH:mm")}
              </span>
            </div>

            <div className="flex items-center gap-3 text-left">
              <MapPin className="text-primary h-4 w-4 shrink-0" />
              <span>Spa Center - Chi nhánh chính</span>
            </div>

            <div className="flex items-center gap-3 text-left">
              <User className="text-primary h-4 w-4 shrink-0" />
              <span>KTV: {staffName}</span>
            </div>
          </div>

          <p className="text-muted-foreground text-xs italic">
            Một email xác nhận đã được gửi đến hộp thư của bạn.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 pt-2 sm:flex-row">
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
