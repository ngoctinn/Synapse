"use client";

import { Badge } from "@/shared/ui/badge";
import { HStack } from "@/shared/ui/layout";
import { Switch } from "@/shared/ui/switch";
import { useTransition } from "react";
import { toast } from "sonner";
import { toggleServiceStatus } from "../actions";
import { Service } from "../model/types";

interface ServiceStatusToggleProps {
  service: Service;
}

export function ServiceStatusToggle({ service }: ServiceStatusToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    startTransition(async () => {
      const result = await toggleServiceStatus(service.id, checked);
      if (result.status === "success") {
        toast.success(
          checked ? `Đã kích hoạt "${service.name}"` : `Đã ẩn "${service.name}"`
        );
      } else {
        toast.error("Không thể thay đổi trạng thái", {
          description: result.message,
        });
      }
    });
  };

  return (
    <HStack
      align="center"
      gap={2}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
    >
      <Switch
        checked={service.is_active}
        onCheckedChange={handleToggle}
        disabled={isPending}
        aria-label={`Trạng thái dịch vụ ${service.name}`}
      />
      <Badge
        variant={service.is_active ? "status-active" : "status-inactive"}
        size="xs"
        className={isPending ? "opacity-50" : ""}
      >
        {isPending ? "..." : service.is_active ? "Hiện" : "Ẩn"}
      </Badge>
    </HStack>
  );
}
