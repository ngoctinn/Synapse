"use client";

import { Treatment } from "@/features/customer-dashboard/types";
import { Badge, BadgeVariant } from "@/shared/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Progress } from "@/shared/ui/progress";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, Sparkles } from "lucide-react";

interface TreatmentListProps {
  treatments: Treatment[];
}

const statusMap: Record<string, { label: string; variant: BadgeVariant }> = {
  ACTIVE: { label: "Đang sử dụng", variant: "violet" },
  COMPLETED: { label: "Hoàn thành", variant: "emerald" },
  EXPIRED: { label: "Hết hạn", variant: "red" },
};

export function TreatmentList({ treatments }: TreatmentListProps) {
  if (treatments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Sparkles className="h-12 w-12 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">Chưa có liệu trình</h3>
        <p className="text-muted-foreground">
          Bạn chưa đăng ký gói liệu trình nào.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {treatments.map((treatment) => {
        const progress =
          (treatment.usedSessions / treatment.totalSessions) * 100;
        return (
          <Card key={treatment.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-base font-semibold leading-none">
                    {treatment.packageName}
                  </CardTitle>
                  <CardDescription>
                    Mua ngày:{" "}
                    {format(new Date(treatment.purchaseDate), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </CardDescription>
                </div>
                <Badge variant={statusMap[treatment.status].variant}>
                  {statusMap[treatment.status].label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Tiến độ</span>
                  <span className="font-medium">
                    {treatment.usedSessions}/{treatment.totalSessions} buổi
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              {treatment.expiryDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="size-4" />
                  <span>
                    Hết hạn:{" "}
                    {format(new Date(treatment.expiryDate), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
