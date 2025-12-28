"use client";

import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CategoryForm } from "./category-form";

export function CreateCategorySheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 size-4" />
          Thêm danh mục
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Thêm Danh mục Mới</SheetTitle>
          <SheetDescription>
            Tạo danh mục mới để phân loại dịch vụ.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <CategoryForm
            mode="create"
            onSuccess={() => setOpen(false)}
            onCancel={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
