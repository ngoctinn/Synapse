"use client";

/**
 * EmptyState - Hiển thị khi không có dữ liệu
 *
 * Variants cho các views khác nhau.
 */

import { Calendar, Filter, Plus, Search } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui";

// ============================================
// TYPES
// ============================================

type EmptyStateVariant = "no-appointments" | "no-results" | "no-filters" | "error";

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

// ============================================
// CONTENT CONFIG
// ============================================

const EMPTY_STATE_CONTENT: Record<
  EmptyStateVariant,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
    actionLabel?: string;
  }
> = {
  "no-appointments": {
    icon: <Calendar className="h-16 w-16 text-muted-foreground/50" />,
    title: "Chưa có lịch hẹn",
    description: "Bắt đầu bằng cách tạo lịch hẹn đầu tiên cho ngày này.",
    actionLabel: "Tạo lịch hẹn",
  },
  "no-results": {
    icon: <Search className="h-16 w-16 text-muted-foreground/50" />,
    title: "Không tìm thấy kết quả",
    description: "Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc.",
    actionLabel: "Xóa bộ lọc",
  },
  "no-filters": {
    icon: <Filter className="h-16 w-16 text-muted-foreground/50" />,
    title: "Không có kết quả phù hợp",
    description: "Không có lịch hẹn nào khớp với bộ lọc hiện tại.",
    actionLabel: "Xóa bộ lọc",
  },
  error: {
    icon: (
      <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
        <span className="text-3xl">⚠️</span>
      </div>
    ),
    title: "Đã xảy ra lỗi",
    description: "Không thể tải dữ liệu. Vui lòng thử lại sau.",
    actionLabel: "Thử lại",
  },
};

// ============================================
// COMPONENT
// ============================================

export function EmptyState({
  variant = "no-appointments",
  title,
  description,
  onAction,
  actionLabel,
  className,
}: EmptyStateProps) {
  const content = EMPTY_STATE_CONTENT[variant];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      {/* Icon */}
      <div className="mb-6">{content.icon}</div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title || content.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        {description || content.description}
      </p>

      {/* Action Button */}
      {onAction && (
        <Button onClick={onAction} className="gap-2">
          {variant === "no-appointments" && <Plus className="h-4 w-4" />}
          {actionLabel || content.actionLabel}
        </Button>
      )}
    </div>
  );
}
