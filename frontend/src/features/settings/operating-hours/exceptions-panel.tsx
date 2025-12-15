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
import { EXCEPTION_TYPE_LABELS, EXCEPTION_TYPE_VARIANTS } from "./constants";
import { ExceptionSheet } from "./exception-sheet";
import { ExceptionDate, ExceptionType } from "./types";

interface ExceptionsPanelProps {
  exceptions: ExceptionDate[];
  onAddExceptions: (exceptions: ExceptionDate[]) => void;
  onRemoveException: (id: string | string[]) => void;
}

const getBadgeVariant = (type: ExceptionType) => EXCEPTION_TYPE_VARIANTS[type] || "outline";

export function ExceptionsPanel({
  exceptions,
  onAddExceptions,
  onRemoveException,
}: ExceptionsPanelProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingException, setEditingException] = useState<ExceptionDate | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sort exceptions by date
  const sortedExceptions = useMemo(() => {
    return [...exceptions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
    <div className="flex flex-col h-full gap-6">
      {/* Header Row */}
      <div className="flex items-center justify-between shrink-0">
        <div className="space-y-1">
          <h3 className="text-lg font-medium leading-none tracking-tight">Danh sách ngoại lệ</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý các ngày nghỉ lễ và giờ làm việc đặc biệt
          </p>
        </div>
        <Button size="sm" onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm ngày
        </Button>
      </div>

      <div className="flex-1 min-h-0">
         <div className="flex flex-col xl:flex-row gap-6 h-full">
            {/* Left: Exceptions List */}
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="flex-1 min-h-0">
                {sortedExceptions.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-xl bg-muted/10">
                    <CalendarDays className="size-12 text-muted-foreground/20 mb-3" />
                    <h3 className="font-medium text-muted-foreground">Chưa có ngày ngoại lệ</h3>
                    <p className="text-xs text-muted-foreground/60 max-w-[200px] mt-1">
                      Thêm các ngày nghỉ lễ hoặc giờ làm việc đặc biệt tại đây.
                    </p>
                  </div>
                ) : (
                  <ScrollArea className="h-full">
                    <div className="space-y-3 pr-4 pb-4">
                      {sortedExceptions.map((exception) => (
                        <div
                          key={exception.id}
                          className="flex items-center justify-between p-4 rounded-xl border bg-card/50 transition-colors hover:bg-card hover:border-primary/20"
                        >
                          <div className="flex items-start gap-4">
                            {/* Date Box */}
                            <div className={cn(
                              "flex flex-col items-center justify-center w-14 h-14 rounded-lg border bg-background shrink-0",
                              exception.isClosed
                                ? "border-destructive/20 text-destructive"
                                : "border-primary/20 text-primary"
                            )}>
                              <span className="text-[10px] uppercase font-bold text-muted-foreground/70">
                                Thg {format(new Date(exception.date), "MM")}
                              </span>
                              <span className="text-xl font-bold leading-none">
                                {format(new Date(exception.date), "dd")}
                              </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-1 my-auto">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">
                                  {format(new Date(exception.date), "EEEE, dd/MM/yyyy", { locale: vi })}
                                </span>
                                <Badge variant={getBadgeVariant(exception.type)} className="text-[10px] px-1.5 h-5 font-normal">
                                  {exception.isClosed ? "Đóng cửa" : EXCEPTION_TYPE_LABELS[exception.type]}
                                </Badge>
                              </div>

                              <div className="text-sm text-muted-foreground line-clamp-1">
                                {exception.reason}
                                {!exception.isClosed && exception.openTime && exception.closeTime && (
                                  <span className="ml-2 font-mono text-xs text-foreground/80 bg-muted px-1.5 py-0.5 rounded">
                                    {exception.openTime} - {exception.closeTime}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(exception)}
                              className="size-8 text-muted-foreground hover:text-foreground"
                            >
                               <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(exception.id)}
                              className="size-8 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
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
          <div className="hidden xl:block shrink-0">
            <div className="w-[320px] rounded-xl border bg-card text-card-foreground shadow-sm p-4 sticky top-0">
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
                    closed: "bg-destructive/20 text-destructive hover:bg-destructive/30",
                    special: "bg-primary/20 text-primary hover:bg-primary/30",
                  }}
                  className="rounded-md w-full"
                  classNames={{
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 transition-colors hover:bg-accent cursor-pointer",
                  }}
                />
                <div className="mt-4 flex flex-wrap gap-3 text-xs justify-center">
                  <div className="flex items-center gap-1.5">
                    <div className="size-3 rounded bg-destructive/20 border border-destructive/30" />
                    <span className="text-muted-foreground">Đóng cửa</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="size-3 rounded bg-primary/20 border border-primary/30" />
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
