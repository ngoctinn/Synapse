"use client";

import { Calendar, Send, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge, Button, Separator } from "@/shared/ui";
import { ActionSheet, Icon } from "@/shared/ui/custom";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";

import { SCHEDULER_UI } from "../../../model/constants";
import { ScheduleWithShift } from "../../../model/types";
import { ShiftInfoCard } from "../calendar/shift-chip";

interface ScheduleDetailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: ScheduleWithShift | null;
  onDelete: (scheduleId: string) => void;
  onPublish: (scheduleId: string) => void;
}

/**
 * Sheet hiển thị chi tiết và cho phép xóa/công bố ca
 */
export function ScheduleDetailSheet({
  open,
  onOpenChange,
  schedule,
  onDelete,
  onPublish,
}: ScheduleDetailSheetProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (!schedule) return null;

  const handleDelete = () => {
    onDelete(schedule.id);
    setShowDeleteDialog(false);
    onOpenChange(false);
  };

  const handlePublish = () => {
    onPublish(schedule.id);
    onOpenChange(false);
  };

  const isDraft = schedule.status === "DRAFT";

  return (
    <>
      <ActionSheet
        open={open}
        onOpenChange={onOpenChange}
        title={
          <div className="flex w-full items-center justify-between gap-4">
            <span className="font-semibold">Chi tiết lịch làm việc</span>
            <Badge
              variant={isDraft ? "warning" : "success"}
              className="text-xs"
            >
              {isDraft ? SCHEDULER_UI.DRAFT : SCHEDULER_UI.PUBLISHED}
            </Badge>
          </div>
        }
        description="Xem chi tiết và quản lý lịch làm việc"
        footer={
          <div className="flex w-full flex-col gap-2">
            {/* Publish button (only for DRAFT) */}
            {isDraft && (
              <Button
                variant="default"
                className="w-full"
                onClick={handlePublish}
              >
                <Icon icon={Send} className="size-4" />
                Công bố lịch
              </Button>
            )}

            {/* Actions row */}
            <div className="flex w-full items-center gap-2">
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-1"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Icon icon={Trash2} className="size-4" />
                Xóa
              </Button>
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                Đóng
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Shift info card - Sử dụng style chữ đậm + nền nhạt */}
          <div className="space-y-3">
            <h3 className="text-muted-foreground text-sm font-medium">
              Ca làm việc
            </h3>
            <ShiftInfoCard shift={schedule.shift} />
          </div>

          <Separator />

          {/* Date */}
          <div className="space-y-3">
            <h3 className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
              <Icon icon={Calendar} className="size-4" />
              Ngày làm việc
            </h3>
            <div className="text-lg font-medium">{schedule.workDate}</div>
          </div>
        </div>
      </ActionSheet>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{SCHEDULER_UI.CONFIRM_DELETE}</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa ca <strong>{schedule.shift.name}</strong>{" "}
              này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
