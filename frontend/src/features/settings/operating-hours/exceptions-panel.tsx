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
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Calendar } from "@/shared/ui/calendar";
import { ConfirmDialog } from "@/shared/ui/custom/confirm-dialog";
import { ScrollArea } from "@/shared/ui/scroll-area";
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
                <div className="flex items-center justify-center p-12 border rounded-lg border-dashed">
                  <div className="text-center space-y-2">
                    <CalendarDays className="size-10 text-muted-foreground/30 mx-auto" />
                    <p className="text-sm font-medium text-muted-foreground">Chưa có ngày ngoại lệ</p>
                      <p className="text-xs text-muted-foreground/70">
                        Nhấn &quot;Thêm ngày&quot; để tạo ngày nghỉ lễ hoặc giờ đặc biệt
                      </p>
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <div className="space-y-3 pr-4">
                    {sortedExceptions.map((exception) => (
                      <div
                        key={exception.id}
                        className="group relative flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-sm transition-all duration-200"
                      >
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "flex flex-col items-center justify-center w-14 h-14 rounded-lg border",
                            exception.isClosed
                              ? "bg-destructive/5 border-destructive/20 text-destructive"
                              : "bg-primary/5 border-primary/20 text-primary"
                          )}>
                            <span className="text-xs font-medium uppercase leading-none mb-1">
                              Tháng {format(new Date(exception.date), "MM")}
                            </span>
                            <span className="text-xl font-bold leading-none">
                              {format(new Date(exception.date), "dd")}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">
                                {format(new Date(exception.date), "EEEE, dd/MM/yyyy", { locale: vi })}
                              </h4>
                              <Badge variant={getBadgeVariant(exception.type)} className="text-[10px] px-1.5 h-5">
                                {exception.isClosed ? "Đóng cửa" : EXCEPTION_TYPE_LABELS[exception.type]}
                              </Badge>
                            </div>

                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="text-xs line-clamp-1">{exception.reason}</span>
                            </div>

                            {!exception.isClosed && exception.openTime && exception.closeTime && (
                              <div className="text-xs font-mono text-muted-foreground pl-1 border-l-2 border-primary/20">
                                {exception.openTime} - {exception.closeTime}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shrink-0">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditClick(exception)}
                            className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
                          >
                             <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(exception.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full"
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

      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Xóa ngày ngoại lệ?"
        description="Hành động này không thể hoàn tác."
        variant="error"
        primaryAction={{
          label: "Xóa",
          onClick: confirmDelete,
          variant: "destructive",
        }}
        secondaryAction={{
          label: "Hủy",
          onClick: () => setDeleteConfirmOpen(false),
        }}
      />
    </div>
  );
}
