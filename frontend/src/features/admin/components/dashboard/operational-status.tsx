import { cn } from "@/shared/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { StatCard } from "@/shared/ui/data-display/stat-card";
import { Grid } from "@/shared/ui/layout/grid";
import { HStack, VStack } from "@/shared/ui/layout/stack";
import { Progress } from "@/shared/ui/progress";
import { Users, Zap } from "lucide-react";

export function OperationalStatus() {
  const resources = [
    { name: "Giường VIP 1", status: "Occupied", usage: 100 },
    { name: "Giường Standard 2", status: "Cleaning", usage: 0 },
    { name: "Khu vực Massage Chân", status: "Available", usage: 20 },
    { name: "Giường Xông hơi Nam", status: "Occupied", usage: 80 },
  ];

  return (
    <Card className="col-span-2 border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Trạng thái vận hành</CardTitle>
        <p className="text-muted-foreground text-sm">
          Tài nguyên & Tài sản theo thời gian thực
        </p>
      </CardHeader>
      <CardContent>
        <VStack gap={6} align="stretch">
          <Grid cols={2}>
            <StatCard
              title="Bận rộn"
              value="85%"
              icon={Zap}
              variant="primary"
            />
            <StatCard
              title="Hiệu suất KTV"
              value="9.2"
              icon={Users}
              variant="accent"
            />
          </Grid>

          <VStack gap={4} className="pt-2" align="stretch">
            {resources.map((res) => (
              <VStack key={res.name} gap={1.5} align="stretch">
                <HStack justify="between" className="text-xs">
                  <span className="font-semibold">{res.name}</span>
                  <span
                    className={cn(
                      res.status === "Available"
                        ? "text-emerald-500"
                        : "text-muted-foreground"
                    )}
                  >
                    {res.status}
                  </span>
                </HStack>
                <Progress value={res.usage} className="h-1.5" />
              </VStack>
            ))}
          </VStack>
        </VStack>
      </CardContent>
    </Card>
  );
}
