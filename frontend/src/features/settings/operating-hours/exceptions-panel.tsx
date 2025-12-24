"use client";

/**
 * ExceptionsPanel - Component quản lý ngày ngoại lệ
 * Tham chiếu: docs/research/operating-hours-uxui.md - Section 4.2
 * Layout: Grid 2 cột (List + Calendar) trên desktop, stack trên mobile
 *
 * [REFACTORED] Fix C2: Sử dụng EXCEPTION_TYPE_LABELS từ constants
 * [REFACTORED] Fix E2: Truyền existingExceptions vào ExceptionSheet
 */

import { cn } from "@/shared/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Badge,
  Button,
  Calendar,
  ScrollArea,
} from "@/shared/ui";
import { format, isSameDay } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { EXCEPTION_TYPE_LABELS } from "./constants";
import { ExceptionSheet } from "./exception-sheet";
import { ExceptionDate } from "./types";

interface ExceptionsPanelProps {
  exceptions: ExceptionDate[];
  onAddExceptions: (exceptions: ExceptionDate[]) => void;
  onRemoveException: (id: string | string[]) => void;
}

export function ExceptionsPanel({
  exceptions,
  onAddExceptions,
  onRemoveException,
}: ExceptionsPanelProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingException, setEditingException] = useState<
    ExceptionDate | undefined
  >(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sort exceptions by date
  const sortedExceptions = useMemo(() => {
    return [...exceptions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [exceptions]);

  // Separate closed and special hours dates for different styling
  const closedDates = useMemo(() => {
    return exceptions.filter((e) => e.isClosed).map((e) => new Date(e.date));
  }, [exceptions]);

  const specialHoursDates = useMemo(() => {
    return exceptions.filter((e) => !e.isClosed).map((e) => new Date(e.date));
  }, [exceptions]);

  // Handle add new
  const handleAddClick = () => {
    setEditingException(undefined);
    setSheetOpen(true);
  };

  // Handle edit
  const handleEditClick = (exception: ExceptionDate) => {
    setEditingException(exception);
    setSheetOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setDeleteConfirmOpen(true);
  };

  // Handle calendar day click
  const handleDayClick = (day: Date) => {
    const existing = exceptions.find((e) => isSameDay(new Date(e.date), day));
    if (existing) {
      handleEditClick(existing);
    }
  };

  const confirmDelete = () => {
    if (deletingId) {
      onRemoveException(deletingId);
      setDeleteConfirmOpen(false);
      setDeletingId(null);
    }
  };

  // Xử lý lưu từ Sheet (thêm mới hoặc cập nhật)
  const handleSheetSave = (data: ExceptionDate) => {
    onAddExceptions([data]);
    setSheetOpen(false);
  };

  return (
    <div className="flex h-full flex-col gap-6">
      {/* Header Row */}
      <div className="flex shrink-0 items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-none tracking-tight">
            Danh sách ngoại lệ
          </h3>
          <p className="text-muted-foreground text-sm">
            Quản lý các ngày nghỉ lễ và giờ làm việc đặc biệt
          </p>
        </div>
        <Button size="sm" onClick={handleAddClick}>
          <Plus className="h-4 w-4" />
          Thêm ngày
        </Button>
      </div>

      <div className="min-h-0 flex-1">
        <div className="flex h-full flex-col gap-6 xl:flex-row">
          {/* Left: Exceptions List */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1">
              {sortedExceptions.length === 0 ? (
                <div className="bg-muted/10 flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
                  <CalendarDays className="text-muted-foreground/20 mb-3 size-12" />
                  <h3 className="text-muted-foreground font-medium">
                    Chưa có ngày ngoại lệ
                  </h3>
                  <p className="text-muted-foreground/60 mt-1 max-w-[200px] text-xs">
                    Thêm các ngày nghỉ lễ hoặc giờ làm việc đặc biệt tại đây.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <div className="space-y-3 pb-4 pr-4">
                    {sortedExceptions.map((exception) => (
                      <div
                        key={exception.id}
                        className="bg-card/50 hover:bg-card hover:border-primary/20 flex items-center justify-between rounded-lg border p-4 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          {/* Date Box */}
                          <div
                            className={cn(
                              "bg-background flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-lg border",
                              exception.isClosed
                                ? "border-destructive/20 text-destructive"
                                : "border-primary/20 text-primary"
                            )}
                          >
                            <span className="text-muted-foreground/70 text-[10px] font-bold uppercase">
                              Thg {format(new Date(exception.date), "MM")}
                            </span>
                            <span className="text-xl font-bold leading-none">
                              {format(new Date(exception.date), "dd")}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="my-auto space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {format(
                                  new Date(exception.date),
                                  "EEEE, dd/MM/yyyy",
                                  { locale: vi }
                                )}
                              </span>
                              <Badge
                                preset={
                                  exception.isClosed
                                    ? "exception-holiday"
                                    : (`exception-${exception.type.toLowerCase().replace("_", "-")}` as
                                        | "exception-holiday"
                                        | "exception-maintenance"
                                        | "exception-special"
                                        | "exception-custom")
                                }
                              >
                                {exception.isClosed
                                  ? "Đóng cửa"
                                  : EXCEPTION_TYPE_LABELS[exception.type]}
                              </Badge>
                            </div>

                            <div className="text-muted-foreground line-clamp-1 text-sm">
                              {exception.reason}
                              {!exception.isClosed &&
                                exception.openTime &&
                                exception.closeTime && (
                                  <span className="text-foreground/80 bg-muted ml-2 rounded px-1.5 py-0.5 font-mono text-xs">
                                    {exception.openTime} - {exception.closeTime}
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex shrink-0 gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(exception)}
                            className="text-muted-foreground hover:text-foreground size-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(exception.id)}
                            className="text-muted-foreground hover:text-destructive size-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>

          {/* Right: Mini Calendar (Desktop only) */}
          <div className="hidden shrink-0 xl:block">
            <div className="bg-card text-card-foreground sticky top-0 w-[320px] rounded-lg border p-4 shadow-sm">
              <Calendar
                mode="single"
                selected={undefined}
                onSelect={(day) => day && handleDayClick(day)}
                locale={vi}
                modifiers={{
                  closed: closedDates,
                  special: specialHoursDates,
                }}
                modifiersClassNames={{
                  closed:
                    "bg-destructive/20 text-destructive hover:bg-destructive/30",
                  special: "bg-primary/20 text-primary hover:bg-primary/30",
                }}
                className="w-full rounded-lg"
                classNames={{
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 transition-colors hover:bg-accent cursor-pointer",
                }}
              />
              <div className="mt-4 flex flex-wrap justify-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="bg-destructive/20 border-destructive/30 size-3 rounded border" />
                  <span className="text-muted-foreground">Đóng cửa</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="bg-primary/20 border-primary/30 size-3 rounded border" />
                  <span className="text-muted-foreground">Giờ đặc biệt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ExceptionSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSave={handleSheetSave}
        exception={editingException}
        existingExceptions={exceptions}
      />

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa ngày ngoại lệ?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
