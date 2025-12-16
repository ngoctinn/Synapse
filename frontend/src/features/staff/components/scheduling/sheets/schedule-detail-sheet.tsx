"use client";

import { Calendar, Send, Trash2 } from "lucide-react";
import { useState } from "react";

import { Badge, Button, Separator } from "@/shared/ui";
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
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

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
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
          {/* Header */}
          <SheetHeader className="px-6 py-4 border-b shrink-0 space-y-0">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-lg font-semibold">Chi tiết lịch làm việc</SheetTitle>
              <Badge
                variant={isDraft ? "warning" : "success"}
                className="text-xs"
              >
                {isDraft ? SCHEDULER_UI.DRAFT : SCHEDULER_UI.PUBLISHED}
              </Badge>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="sheet-scroll-area">
            <div className="space-y-6">
              {/* Shift info card - Sử dụng style chữ đậm + nền nhạt */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">Ca làm việc</h3>
                <ShiftInfoCard shift={schedule.shift} />
              </div>

              <Separator />

              {/* Date */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="size-4" />
                  Ngày làm việc
                </h3>
                <div className="font-medium text-lg">{schedule.workDate}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <SheetFooter className="px-6 py-3 border-t bg-background flex-col gap-2">
            {/* Publish button (only for DRAFT) */}
            {isDraft && (
              <Button variant="default" className="w-full h-9" onClick={handlePublish}>
                <Send className="size-4 mr-2" />
                Công bố lịch
              </Button>
            )}

            {/* Actions row */}
            <div className="flex items-center gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1 h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash2 className="size-4 mr-2" />
                Xóa
              </Button>
              <Button variant="ghost" className="flex-1 h-9" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{SCHEDULER_UI.CONFIRM_DELETE}</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa ca <strong>{schedule.shift.name}</strong> này? Hành động
              này không thể hoàn tác.
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
