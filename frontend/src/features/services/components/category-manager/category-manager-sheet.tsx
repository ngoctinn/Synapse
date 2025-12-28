import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Box, HStack, VStack } from "@/shared/ui/layout";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/shared/ui/sheet";
import { Loader2, Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { MOCK_CATEGORIES } from "../../model/mocks";
import { ServiceCategory } from "../../model/types";
import { SortableCategoryList } from "./sortable-category-list";

interface CategoryManagerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCategoriesChange?: (categories: ServiceCategory[]) => void;
}

export function CategoryManagerSheet({
  open,
  onOpenChange,
  onCategoriesChange,
}: CategoryManagerSheetProps) {
  // Local state for categories (initialized from mocks for now, normally would be props)
  const [categories, setCategories] =
    useState<ServiceCategory[]>(MOCK_CATEGORIES);
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
    setCategories(categories.map((c) => (c.id === id ? { ...c, name } : c)));
    setHasChanges(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc muốn xóa danh mục này?")) {
      setCategories(categories.filter((c) => c.id !== id));
      setHasChanges(true);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 800));

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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full w-full flex-col sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Quản lý Danh mục Dịch vụ</SheetTitle>
          <SheetDescription>
            Thêm, sửa, xóa và sắp xếp thứ tự hiển thị của các danh mục.
          </SheetDescription>
        </SheetHeader>

        <VStack gap={4} className="mt-4 flex-1 overflow-hidden">
            <HStack gap={2}>
              <Input
                placeholder="Tên danh mục mới..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
              />
              <Button
                onClick={handleAddCategory}
                disabled={!newCategoryName.trim()}
                size="sm"
              >
                <Plus className="mr-2 size-4" /> Thêm
              </Button>
            </HStack>

            <Box className="flex-1 overflow-y-auto rounded-md border p-2">
              {categories.length === 0 ? (
                <Box className="py-8 text-center text-sm text-muted-foreground">
                  Chưa có danh mục nào.
                </Box>
              ) : (
                <SortableCategoryList
                  items={categories}
                  onReorder={handleReorder}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              )}
            </Box>
        </VStack>

        <SheetFooter className="mt-4 gap-2 sm:gap-0">
          {hasChanges && (
            <Box className="flex flex-1 items-center text-sm font-medium text-amber-600 animate-pulse">
              Thứ tự/Dữ liệu đã thay đổi *
            </Box>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges && !isSaving}>
            {isSaving ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Save className="mr-2 size-4" />
            )}
            Lưu thay đổi
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
