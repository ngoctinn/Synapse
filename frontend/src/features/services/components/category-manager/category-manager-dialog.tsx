"use client";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Loader2, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { MOCK_CATEGORIES } from "../../model/mocks";
import { ServiceCategory } from "../../model/types";
import { SortableCategoryList } from "./sortable-category-list";

interface CategoryManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoriesChange?: (categories: ServiceCategory[]) => void;
}

export function CategoryManagerDialog({
  open,
  onOpenChange,
  onCategoriesChange,
}: CategoryManagerDialogProps) {
  // Local state for categories (initialized from mocks for now, normally would be props)
  const [categories, setCategories] = useState<ServiceCategory[]>(MOCK_CATEGORIES);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Reset state when opening
  useEffect(() => {
    if (open) {
      // In a real app, we would fetch fresh categories here
      // setCategories(freshCategories)
      setHasChanges(false);
    }
  }, [open]);

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: ServiceCategory = {
      id: `cat_${uuidv4().slice(0, 8)}`,
      name: newCategoryName.trim(),
      sort_order: categories.length,
    };

    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    setHasChanges(true);
    toast.success("Đã thêm danh mục tạm thời (Nhớ bấm Lưu)");
  };

  const handleReorder = (newItems: ServiceCategory[]) => {
    setCategories(newItems);
    setHasChanges(true);
  };

  const handleUpdate = (id: string, name: string) => {
    setCategories(categories.map(c => c.id === id ? { ...c, name } : c));
    setHasChanges(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
      setCategories(categories.filter(c => c.id !== id));
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));

      // Notify parent
      onCategoriesChange?.(categories);

      setHasChanges(false);
      toast.success("Đã lưu thay đổi danh mục");
      onOpenChange(false);
    } catch {
      toast.error("Lỗi khi lưu danh mục");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md flex flex-col max-h-[80vh] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0 space-y-0">
          <DialogTitle className="text-lg">Quản lý Danh mục Dịch vụ</DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 p-4 border-b">
          <Input
            placeholder="Tên danh mục mới..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
          />
          <Button onClick={handleAddCategory} disabled={!newCategoryName.trim()}>
            <Plus className="h-4 w-4 mr-1" /> Thêm
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
             {categories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                    Chưa có danh mục nào.
                </div>
             ) : (
                <SortableCategoryList
                    items={categories}
                    onReorder={handleReorder}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                />
             )}
        </div>

        <DialogFooter className="mt-4 pt-4 border-t gap-2 sm:gap-0">
         {hasChanges && (
            <div className="flex-1 flex items-center text-amber-600 text-sm font-medium animate-pulse">
                Thứ tự/Dữ liệu đã thay đổi *
            </div>
         )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges && !isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
