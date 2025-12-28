"use client";

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Column } from "@/shared/ui/custom/data-table";
import { Icon } from "@/shared/ui/custom/icon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Group, Stack } from "@/shared/ui/layout";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MoreHorizontal,
  Pencil,
  Trash,
  User,
  XCircle,
} from "lucide-react";
import { WaitlistEntry } from "../model/types";

interface WaitlistColumnsProps {
  onStatusUpdate: (id: string, status: WaitlistEntry["status"]) => void;
  onDelete: (id: string) => void;
  onEdit: (entry: WaitlistEntry) => void;
}

export const getWaitlistColumns = ({
  onStatusUpdate,
  onDelete,
  onEdit,
}: WaitlistColumnsProps): Column<WaitlistEntry>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <div className="pl-4">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="pl-4">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    header: "Khách hàng",
    accessorKey: "customer_name",
    enableSorting: true,
    cell: ({ row }) => (
      <Group gap={3}>
        <div className="bg-muted text-muted-foreground flex h-9 w-9 items-center justify-center rounded-full">
          <User className="h-4 w-4" />
        </div>
        <Stack gap={0}>
          <span className="font-medium">{row.original.customer_name}</span>
          <span className="text-muted-foreground text-xs">
            {row.original.phone_number}
          </span>
        </Stack>
      </Group>
    ),
  },
  {
    header: "Thời gian mong muốn",
    accessorKey: "preferred_date",
    enableSorting: true,
    cell: ({ row }) => {
      const date = row.original.preferred_date
        ? format(new Date(row.original.preferred_date), "dd/MM/yyyy", {
            locale: vi,
          })
        : "--";
      const time = row.original.preferred_time_slot || "--"; // Changed from preferred_time to preferred_time_slot

      return (
        <Stack gap={1}>
          <Group gap={2} className="text-sm">
            <CalendarDays className="h-3.5 w-3.5 text-blue-500" />
            <span>{date}</span>
          </Group>
          <Group gap={2} className="text-muted-foreground text-xs">
            <Clock className="h-3.5 w-3.5" />
            <span>{time}</span>
          </Group>
        </Stack>
      );
    },
  },
  {
    header: "Yêu cầu",
    accessorKey: "service_name",
    cell: ({ row }) => (
      <div className="truncate font-medium max-w-[200px]" title={row.original.service_name}>
        {row.original.service_name || "Bất kỳ dịch vụ nào"}
      </div>
    ),
  },
  {
    header: "Ghi chú",
    accessorKey: "notes", // Changed from "note" to "notes" to match original
    cell: ({ row }) => (
      <div className="text-muted-foreground max-w-[200px] truncate text-sm italic">
        {row.original.notes || "--"}
      </div>
    ),
  },
  {
    header: "Trạng thái",
    accessorKey: "status",
    enableSorting: true,
    cell: ({ row }) => {
      const status = row.original.status;
      const variants: Record<string, "default" | "secondary" | "outline"> = {
        pending: "outline",
        notified: "secondary",
        converted: "default", // Changed from booked to converted to match original
        cancelled: "secondary",
        expired: "secondary",
      };

      const labels: Record<string, string> = {
        pending: "Đang chờ",
        notified: "Đã thông báo",
        converted: "Đã đặt lịch", // Changed from booked to converted to match original
        cancelled: "Đã hủy",
        expired: "Hết hạn",
      };

      return (
        <Badge variant={variants[status] || "outline"}>
          {labels[status] || status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex justify-end pr-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className="mr-2 h-4 w-4" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onStatusUpdate(row.original.id, "notified")}
            >
              <Icon icon={Clock} className="mr-2" size="sm" /> Đã thông báo
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onStatusUpdate(row.original.id, "converted")}
            >
              <Icon icon={CheckCircle2} className="mr-2" size="sm" /> Chuyển
              thành lịch hẹn
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onStatusUpdate(row.original.id, "cancelled")}
              className="text-destructive"
            >
              <Icon icon={XCircle} className="mr-2" size="sm" /> Hủy yêu cầu
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(row.original.id)}
              className="text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
