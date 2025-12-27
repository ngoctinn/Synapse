import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { HStack, VStack } from "@/shared/ui/layout/stack";
import { Text } from "@/shared/ui/typography";
import { Clock, MoreHorizontal, Scissors } from "lucide-react";
import Link from "next/link";

export function RecentAppointments() {
  const appointments = [
    {
      id: "1",
      customer: "Lê Thị Thu",
      service: "Massage Thụy Điển",
      time: "14:30",
      status: "checked-in",
      staff: "Nguyễn An",
      staffAvatar: "",
    },
    {
      id: "2",
      customer: "Trần Minh Tâm",
      service: "Chăm sóc da mặt chuyên sâu",
      time: "15:00",
      status: "pending",
      staff: "Lê Bình",
      staffAvatar: "",
    },
    {
      id: "3",
      customer: "Phạm Hồng Nhung",
      service: "Gội đầu dưỡng sinh",
      time: "15:15",
      status: "pending",
      staff: "Trương Cường",
      staffAvatar: "",
    },
    {
      id: "4",
      customer: "Ngô Quốc Bảo",
      service: "Trị liệu vai gáy",
      time: "16:00",
      status: "pending",
      staff: "Đặng Dũng",
      staffAvatar: "",
    },
  ];

  const statusMap = {
    pending: { label: "Sắp tới", variant: "secondary" as const },
    "checked-in": { label: "Đã đến", variant: "default" as const },
    completed: { label: "Hoàn thành", variant: "success" as const },
    cancelled: { label: "Đã hủy", variant: "destructive" as const },
  };

  return (
    <Card className="col-span-3 border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <VStack gap={1}>
          <CardTitle className="text-lg font-bold">Lịch hẹn sắp tới</CardTitle>
          <Text variant="muted" size="sm">
            Theo dõi các ca làm việc tiếp theo
          </Text>
        </VStack>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/appointments">Xem tất cả</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <VStack gap={6}>
          {appointments.map((apt) => (
            <HStack
              key={apt.id}
              className="group w-full"
              justify="between"
              align="center"
            >
              <HStack gap={4}>
                <VStack
                  className="bg-muted w-14 shrink-0 rounded-lg py-2.5"
                  align="center"
                  justify="center"
                  gap={1}
                >
                  <Text size="xs" weight="bold" className="leading-none">
                    {apt.time}
                  </Text>
                  <Clock className="size-3 opacity-60" />
                </VStack>
                <VStack gap={0.5}>
                  <Text
                    size="sm"
                    weight="bold"
                    className="group-hover:text-primary cursor-pointer transition-colors"
                  >
                    {apt.customer}
                  </Text>
                  <HStack gap={1} className="opacity-80">
                    <Scissors className="size-3" />
                    <Text size="xs" variant="muted">
                      {apt.service}
                    </Text>
                  </HStack>
                </VStack>
              </HStack>
              <HStack gap={6}>
                <VStack className="hidden md:flex" align="end" gap={1}>
                  <Text size="sm" weight="medium" className="leading-none">
                    {apt.staff}
                  </Text>
                  <Text size="xs" variant="muted" className="opacity-80">
                    Chuyên viên
                  </Text>
                </VStack>

                <Badge
                  variant={
                    statusMap[apt.status as keyof typeof statusMap].variant
                  }
                  className="px-3 py-0.5 font-medium"
                >
                  {statusMap[apt.status as keyof typeof statusMap].label}
                </Badge>
                <Button variant="ghost" size="icon" className="size-8">
                  <MoreHorizontal className="size-4" />
                </Button>
              </HStack>
            </HStack>
          ))}
        </VStack>
      </CardContent>
    </Card>
  );
}
