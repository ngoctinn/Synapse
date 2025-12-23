"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Progress } from "@/shared/ui/progress";
import { Hotel, Users, Zap } from "lucide-react";

export function OperationalStatus() {
  const resources = [
    { name: "Phòng VIP 1", status: "Occupied", usage: 100 },
    { name: "Phòng Standard 2", status: "Cleaning", usage: 0 },
    { name: "Khu vực Massage Chân", status: "Available", usage: 20 },
    { name: "Phòng Xông hơi Nam", status: "Occupied", usage: 80 },
  ];

  return (
    <Card className="col-span-2 border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Trạng thái vận hành</CardTitle>
        <p className="text-muted-foreground text-sm">
          Tài nguyên & Tài sản theo thời gian thực
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/5 border-primary/10 flex flex-col gap-1 rounded-xl border p-3">
            <span className="text-primary/60 text-[10px] font-bold uppercase">
              Bận rộn
            </span>
            <div className="flex items-end gap-2">
              <span className="text-xl font-black">85%</span>
              <Zap className="mb-1 size-4 text-amber-500" />
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl border border-blue-500/10 bg-blue-500/5 p-3">
            <span className="text-[10px] font-bold uppercase text-blue-500/60">
              Hiệu suất KTV
            </span>
            <div className="flex items-end gap-2">
              <span className="text-xl font-black">9.2</span>
              <Users className="mb-1 size-4 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {resources.map((res) => (
            <div key={res.name} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold">{res.name}</span>
                <span
                  className={
                    res.status === "Available"
                      ? "text-emerald-500"
                      : "text-muted-foreground"
                  }
                >
                  {res.status}
                </span>
              </div>
              <Progress value={res.usage} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
