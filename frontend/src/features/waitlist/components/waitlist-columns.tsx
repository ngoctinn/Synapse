"use client";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Column } from "@/shared/ui/custom/data-table";
import { Icon } from "@/shared/ui/custom/icon";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Phone,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { WaitlistEntry } from "../model/types";

interface GetColumnsProps {
  onStatusUpdate: (id: string, status: WaitlistEntry["status"]) => void;
  onDelete: (id: string) => void;
  onEdit: (entry: WaitlistEntry) => void;
}

export const getWaitlistColumns = ({
  onStatusUpdate,
  onDelete,
  onEdit,
}: GetColumnsProps): Column<WaitlistEntry>[] => [
  {
    header: "Khách hàng",
    accessorKey: "customer_name",
    cell: (w) => (
      <div className="flex flex-col">
        <span className="font-medium text-foreground">{w.customer_name}</span>
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <Icon icon={Phone} size="xs" /> {w.phone_number}
        </div>
      </div>
    ),
  },
  {
    header: "Dịch vụ quan tâm",
    accessorKey: "service_name",
    cell: (w) => <div className="text-sm">{w.service_name}</div>,
  },
  {
    header: "Thời gian mong muốn",
    accessorKey: "preferred_date",
    sortable: true,
    cell: (w) => (
      <div className="flex flex-col text-sm">
        <span>
          {format(new Date(w.preferred_date), "dd/MM/yyyy", { locale: vi })}
        </span>
        <span className="text-muted-foreground text-xs">
          {w.preferred_time_slot}
        </span>
      </div>
    ),
  },
  {
    header: "Trạng thái",
    accessorKey: "status",
    cell: (w) => {
      const labels: Record<string, string> = {
        pending: "Đang chờ",
        notified: "Đã thông báo",
        converted: "Đã đặt lịch",
        cancelled: "Đã hủy",
        expired: "Hết hạn",
      };
      const presets: Record<string, any> = {
        pending: "appointment-pending",
        notified: "appointment-confirmed",
        converted: "appointment-completed",
        cancelled: "appointment-cancelled",
        expired: "appointment-no-show",
      };
      return <Badge preset={presets[w.status]} />;
    },
  },
  {
    header: "Ghi chú",
    accessorKey: "notes",
    cell: (w) => (
      <div
        className="text-muted-foreground max-w-[200px] truncate text-sm"
        title={w.notes || ""}
      >
        {w.notes || "-"}
      </div>
    ),
  },
  {
    header: "",
    id: "actions",
    cell: (w) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <span className="sr-only">Mở menu</span>
              <Icon icon={MoreHorizontal} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(w)}>
              Sửa yêu cầu
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onStatusUpdate(w.id, "notified")}
            >
              <Icon icon={Clock} className="mr-2" size="sm" /> Đã thông báo
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusUpdate(w.id, "converted")}
            >
              <Icon icon={CheckCircle2} className="mr-2" size="sm" /> Chuyển
              thành lịch hẹn
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onStatusUpdate(w.id, "cancelled")}
              className="text-destructive"
            >
              <Icon icon={XCircle} className="mr-2" size="sm" /> Hủy yêu cầu
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(w.id)}
              className="text-destructive"
            >
              Xóa vĩnh viễn
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
