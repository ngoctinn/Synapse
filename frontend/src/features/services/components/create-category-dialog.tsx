"use client";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { CategoryForm } from "./category-form";

interface CreateCategoryDialogProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function CreateCategoryDialog({
  onSuccess,
  trigger,
}: CreateCategoryDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="sm">
            <Plus className="mr-2 size-4" />
            Thêm danh mục
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm Danh mục Mới</DialogTitle>
          <DialogDescription>
            Tạo nhanh danh mục mới để gán cho dịch vụ.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2">
          <CategoryForm
            mode="create"
            onSuccess={() => {
              setOpen(false);
              onSuccess?.();
            }}
            onCancel={() => setOpen(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
