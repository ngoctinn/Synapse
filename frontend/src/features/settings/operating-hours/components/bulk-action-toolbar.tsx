import { Button } from "@/shared/ui/button";
import { X, Trash2, Pencil } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface BulkActionToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onDelete: () => void;
  onEdit?: () => void;
  className?: string;
}

export function BulkActionToolbar({
  selectedCount,
  onClearSelection,
  onDelete,
  onEdit,
  className,
}: BulkActionToolbarProps) {
  return (
    <div
      className={cn(
        "sticky top-0 z-30 bg-primary/5 backdrop-blur-sm border-b border-primary/20 px-4 py-3 flex items-center justify-between gap-4 w-full shrink-0 animate-in fade-in slide-in-from-top-1",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearSelection}
          className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
        >
          <X className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium text-primary">
          Đã chọn {selectedCount} ngày
        </span>
      </div>

      <div className="flex items-center gap-2">
        {onEdit && (
            <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="h-8 gap-2 border-primary/20 hover:bg-primary/10 hover:text-primary text-primary/80"
            >
            <Pencil className="h-3.5 w-3.5" />
            Sửa
            </Button>
        )}
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="h-8 gap-2 shadow-sm"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Xóa ({selectedCount})
        </Button>
      </div>
    </div>
  );
}
