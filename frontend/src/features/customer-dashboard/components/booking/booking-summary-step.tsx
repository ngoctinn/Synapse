"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent } from "@/shared/ui/card";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Clock, MessageSquare, Sparkles, User } from "lucide-react";
import { BookingService, BookingTechnician } from "../../schemas/booking-schema";

interface BookingSummaryStepProps {
  service?: BookingService;
  date?: Date;
  timeSlot: string;
  technician?: BookingTechnician;
  notes?: string;
  onNotesChange: (notes: string) => void;
}

export function BookingSummaryStep({
  service,
  date,
  timeSlot,
  technician,
  notes,
  onNotesChange,
}: BookingSummaryStepProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}p` : `${hours} giờ`;
  };

  return (
    <div className="space-y-5">
      {/* Summary Card */}
      <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-4 space-y-4">
          {/* Service */}
          {service && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                  Dịch vụ
                </p>
                <p className="font-semibold text-foreground">{service.name}</p>
                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDuration(service.duration)}
                  </span>
                  <span className="font-bold text-primary">
                    {formatPrice(service.price)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="h-px bg-border/50" />

          {/* Date & Time */}
          {date && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                  Thời gian
                </p>
                <p className="font-semibold text-foreground">
                  {format(date, "EEEE, dd/MM/yyyy", { locale: vi })}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Lúc <span className="font-medium text-foreground">{timeSlot}</span>
                </p>
              </div>
            </div>
          )}

          <div className="h-px bg-border/50" />

          {/* Technician */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                Kỹ thuật viên
              </p>
              {technician ? (
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={technician.avatar_url} alt={technician.name} />
                    <AvatarFallback className="text-[10px]">
                      {technician.name.split(" ").pop()?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold text-foreground">{technician.name}</span>
                  {technician.title && (
                    <Badge variant="secondary" className="text-[10px]">
                      {technician.title}
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Để Spa phân bổ phù hợp
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <Label className="font-medium text-foreground/80">
            Ghi chú <span className="text-muted-foreground font-normal">(tùy chọn)</span>
          </Label>
        </div>
        <Textarea
          placeholder="VD: Da nhạy cảm, muốn dùng tinh dầu lavender..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="min-h-[80px] resize-none rounded-xl bg-background"
          maxLength={500}
        />
        <p className="text-xs text-muted-foreground text-right">
          {notes?.length || 0}/500 ký tự
        </p>
      </div>

      {/* Reminder */}
      <div className="rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-3 text-sm">
        <p className="text-amber-800 dark:text-amber-200">
          <strong>Lưu ý:</strong> Vui lòng đến trước giờ hẹn 10-15 phút. Trong trường hợp cần
          thay đổi, hãy liên hệ Spa trước ít nhất 2 giờ.
        </p>
      </div>
    </div>
  );
}
