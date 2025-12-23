import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  Calendar,
  Clock,
  User,
  ClipboardList,
  ChevronRight,
} from "lucide-react";

export default function WorkspacePage() {
  // Mock data cho lịch làm việc của KTV
  const todayTasks = [
    {
      id: "1",
      customer: "Nguyễn Văn A",
      service: "Massage Trị Liệu",
      time: "14:00 - 15:30",
      room: "Phòng VIP 2",
      status: "ongoing",
    },
    {
      id: "2",
      customer: "Trần Thị B",
      service: "Chăm Sóc Da",
      time: "16:00 - 17:00",
      room: "Standard 1",
      status: "pending",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 pb-20 md:p-8 md:pb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-black">Không gian làm việc</h1>
        <p className="text-muted-foreground text-sm">
          Chào buổi chiều! Bạn có 2 ca làm việc hôm nay.
        </p>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-primary/5 border-primary/10">
          <CardContent className="flex flex-col gap-2 p-4">
            <Calendar className="text-primary size-5" />
            <div className="text-xl font-bold">Lịch cá nhân</div>
            <p className="text-muted-foreground text-[10px] font-bold uppercase">
              Xem lịch tuần
            </p>
          </CardContent>
        </Card>
        <Card className="border-purple-500/10 bg-purple-500/5">
          <CardContent className="flex flex-col gap-2 p-4">
            <ClipboardList className="size-5 text-purple-500" />
            <div className="text-xl font-bold">Ghi chú nhanh</div>
            <p className="text-muted-foreground text-[10px] font-bold uppercase">
              3 ghi chú mới
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Lịch làm việc hôm nay</h2>
          <Badge variant="outline">Thứ 2, 22/12</Badge>
        </div>

        <div className="space-y-3">
          {todayTasks.map((task) => (
            <Card
              key={task.id}
              className="group overflow-hidden border-none shadow-sm transition-shadow hover:shadow-md"
            >
              <CardContent className="p-0">
                <div className="flex">
                  <div
                    className={
                      task.status === "ongoing"
                        ? "bg-primary w-1.5"
                        : "bg-muted w-1.5"
                    }
                  />
                  <div className="flex-1 p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-muted flex size-8 items-center justify-center rounded-full">
                          <User className="size-4" />
                        </div>
                        <span className="font-bold">{task.customer}</span>
                      </div>
                      <Badge
                        variant={
                          task.status === "ongoing" ? "default" : "secondary"
                        }
                      >
                        {task.status === "ongoing"
                          ? "Đang thực hiện"
                          : "Sắp tới"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                        <ClipboardList className="text-primary size-4" />
                        {task.service}
                      </div>
                      <div className="flex items-center justify-between border-t border-dashed pt-2 text-xs">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Clock className="text-muted-foreground size-3" />
                            {task.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <Hotel className="text-muted-foreground size-3" />
                            {task.room}
                          </div>
                        </div>
                        <ChevronRight className="text-muted-foreground size-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hotel({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 21h18" />
      <path d="M5 21V7a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14" />
      <path d="M9 11h2" />
      <path d="M9 15h2" />
      <path d="M13 11h2" />
      <path d="M13 15h2" />
    </svg>
  );
}
