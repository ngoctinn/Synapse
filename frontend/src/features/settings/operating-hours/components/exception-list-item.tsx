"use client";

import { useState } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  List as ListIcon,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
} from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/shared/ui/collapsible";
import { cn } from "@/shared/lib/utils";

import { GroupedException, getFormattedDateRanges } from "../utils/grouping";
import { getStatusStyles } from "../utils/style-helpers";

interface ExceptionListItemProps {
  group: GroupedException;
  showYearHeader: boolean;
  selectedDateIds: Set<string>;
  onSelectGroup: (dates: Date[], isFullySelected: boolean) => void;
  onEdit: (dates: Date[]) => void;
  onRemove: (ids: string[]) => void;
  onToggleDate: (date: Date) => void;
}

export function ExceptionListItem({
  group,
  showYearHeader,
  selectedDateIds,
  onSelectGroup,
  onEdit,
  onRemove,
  onToggleDate,
}: ExceptionListItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const styles = getStatusStyles(group.type, group.isClosed);

  // Check selection state
  const groupDateStrings = group.dates.map((d) => format(d, "yyyy-MM-dd"));
  const selectedCount = groupDateStrings.filter((d) => selectedDateIds.has(d)).length;
  const isFullySelected = selectedCount === group.dates.length && group.dates.length > 0;
  const isPartiallySelected = selectedCount > 0 && !isFullySelected;

  const isSelected = isFullySelected || isPartiallySelected;

  const dateRanges = getFormattedDateRanges(group.dates);
  const showDetailsToggle = group.dates.length > 5;

  return (
    <div className="space-y-4">
      {showYearHeader && (
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-2 -mx-1 px-1 border-b border-border/40 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground border px-2 py-0.5 rounded-md bg-muted/50 shadow-sm">
              {group.year}
            </span>
          </div>
        </div>
      )}

      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
        <div
          className={cn(
            "group relative flex items-start gap-3 p-3 rounded-xl border bg-card transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2 duration-300",
            isSelected
              ? "ring-2 ring-primary border-primary bg-primary/5"
              : "hover:border-primary/30 hover:bg-muted/30"
          )}
        >
          {/* 1. Visual Indicator (Left Icon Box) - Date Anchor */}
          <div
            className={cn(
              "flex flex-col items-center justify-center w-14 h-14 rounded-xl border shadow-sm shrink-0 transition-colors",
              styles.bg,
              styles.border
            )}
          >
            <span className={cn("text-[10px] uppercase opacity-80 font-bold leading-none mb-0.5", styles.text)}>
              Thg {group.dates[0] ? format(group.dates[0], "M") : "--"}
            </span>
            <span className={cn("text-xl font-bold leading-none", styles.text)}>
              {group.dates[0] ? format(group.dates[0], "d") : "--"}
            </span>
          </div>

          {/* 2. Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 w-full">
                <div className="flex items-center justify-between mb-1.5">
                  <h4
                    className={cn(
                      "font-semibold text-sm truncate leading-tight cursor-pointer hover:text-primary transition-colors",
                      !group.reason && "text-muted-foreground italic"
                    )}
                    title={group.reason || "Không có tiêu đề"}
                    onClick={() => onEdit(group.dates)}
                  >
                    {group.reason || "Ngoại lệ tùy chỉnh"}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap mb-2">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] h-5 px-1.5 font-medium shadow-none border-transparent",
                      styles.bg,
                      styles.text
                    )}
                  >
                    {group.type === "holiday"
                      ? "Ngày lễ"
                      : group.type === "maintenance"
                      ? "Bảo trì"
                      : "Tùy chỉnh"}
                  </Badge>

                  <span className="text-[10px] text-muted-foreground/60">•</span>

                  {group.isClosed ? (
                    <span className="text-[10px] font-semibold text-rose-600">
                      Đóng cửa
                    </span>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-emerald-600">
                        Mở cửa
                      </span>
                      {group.modifiedHours && group.modifiedHours.length > 0 && (
                        <>
                          <span className="text-[10px] text-muted-foreground/60">•</span>
                          <div className="flex items-center gap-1 text-[10px] font-medium text-foreground/80 bg-muted/50 px-1.5 py-0.5 rounded-sm">
                            <Clock className="w-3 h-3" />
                            {group.modifiedHours
                              .map((s) => `${s.start} - ${s.end}`)
                              .join(", ")}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Date Ranges (Always Visible) */}
                <CollapsibleContent
                  forceMount
                  className={cn("w-full transition-all", isOpen ? "hidden" : "block")}
                >
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {dateRanges.slice(0, 3).map((range, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="px-1.5 py-0 text-[10px] text-muted-foreground bg-muted/50 hover:bg-muted font-normal border-dotted border-muted-foreground/30"
                      >
                        {range}
                      </Badge>
                    ))}
                    {dateRanges.length > 3 && (
                      <span className="text-[10px] text-muted-foreground italic">
                        + {dateRanges.length - 3} khoảng thời gian
                      </span>
                    )}

                    {showDetailsToggle && (
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 px-1.5 text-[10px] gap-1 text-primary hover:text-primary hover:bg-primary/10 -ml-1"
                        >
                          Xem chi tiết {group.dates.length} ngày{" "}
                          <ChevronDown className="w-3 h-3" />
                        </Button>
                      </CollapsibleTrigger>
                    )}

                    {!showDetailsToggle && (
                      <span className="text-[10px] text-muted-foreground self-center ml-1">
                        ({group.dates.length} ngày)
                      </span>
                    )}
                  </div>
                </CollapsibleContent>

                {/* Full Date Grid (Expanded) */}
                <CollapsibleContent className="mt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Danh sách ngày ({group.dates.length})
                    </span>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 px-1.5 text-[10px] gap-1 text-muted-foreground hover:text-foreground"
                      >
                        Thu gọn <ChevronUp className="w-3 h-3" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5">
                    {group.dates.map((date, idx) => {
                      const dateStr = format(date, "yyyy-MM-dd");
                      const isDateSelected = selectedDateIds.has(dateStr);
                      return (
                        <div
                          key={idx}
                          className={cn(
                            "text-[10px] px-1.5 py-1 rounded border text-center cursor-pointer transition-colors",
                            isDateSelected
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-muted/30 border-transparent hover:bg-muted hover:border-border"
                          )}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleDate(date);
                          }}
                        >
                          <div className="font-medium">{format(date, "dd/MM")}</div>
                          <div
                            className={cn(
                              "text-[9px] opacity-70",
                              isDateSelected
                                ? "text-primary-foreground/80"
                                : "text-muted-foreground"
                            )}
                          >
                            {format(date, "EEEE", { locale: vi })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CollapsibleContent>
              </div>
            </div>
          </div>

          {/* 3. Hover Actions (Floating) */}
          <div
            className={cn(
              "absolute right-2 top-2 flex gap-1 transition-all duration-200 bg-background/95 backdrop-blur-sm rounded-md border shadow-sm p-0.5 z-10",
              isSelected
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0"
            )}
          >
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 hover:bg-muted hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(group.dates);
              }}
              title="Chỉnh sửa nhóm"
            >
              <Pencil className="w-3 h-3" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(group.originalIds);
              }}
              title="Xóa nhóm"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </Collapsible>
    </div>
  );
}
