"use client";

/**
 * ExceptionsPanel - Component quản lý ngày ngoại lệ
 * Tham chiếu: docs/research/operating-hours-uxui.md - Section 4.2
 *
 * TODO: Implement full UI in Phase 3
 */

import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Empty } from "@/shared/ui/empty";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Plus } from "lucide-react";
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
  const sortedExceptions = [...exceptions].sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Ngày ngoại lệ</h3>
        <Button size="sm" onClick={() => {
          // TODO: Open sheet to add exception
          console.log("Add exception clicked");
        }}>
          <Plus className="size-4 mr-2" />
          Thêm ngày
        </Button>
      </div>

      {sortedExceptions.length === 0 ? (
        <Empty>
          <p className="text-lg font-medium">Chưa có ngày ngoại lệ</p>
          <p className="text-sm text-muted-foreground">
            Thêm ngày nghỉ lễ hoặc giờ hoạt động đặc biệt
          </p>
        </Empty>
      ) : (
        <div className="space-y-2 flex-1 overflow-auto">
          {sortedExceptions.map((exception) => (
            <div
              key={exception.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div className="flex items-center gap-3">
                <Badge variant={exception.isClosed ? "destructive" : "secondary"}>
                  {exception.isClosed ? "Đóng cửa" : "Giờ đặc biệt"}
                </Badge>
                <div>
                  <p className="font-medium">
                    {format(exception.date, "dd/MM/yyyy", { locale: vi })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {exception.reason}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveException(exception.id)}
              >
                Xóa
              </Button>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 text-sm text-muted-foreground text-center">
        🚧 Component đang được xây dựng lại theo thiết kế mới
      </p>
    </div>
  );
}

// Legacy alias for backwards compatibility
export { ExceptionsPanel as ExceptionsViewManager };
