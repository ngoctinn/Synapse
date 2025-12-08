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
import { Edit, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createResource, updateResource } from "../actions";
import { ResourceFormValues } from "../model/schema";
import { Resource } from "../model/types";
import { ResourceForm } from "./resource-form";

interface ResourceSheetProps {
  resource?: Resource; // If provided, existing resource to edit
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ResourceSheet({
  resource,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ResourceSheetProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (values: ResourceFormValues) => {
    setIsLoading(true);
    try {
      if (resource) {
        await updateResource(resource.id, values);
        toast.success("Cập nhật tài nguyên thành công");
      } else {
        await createResource(values);
        toast.success("Tạo tài nguyên mới thành công");
      }
      onOpenChange?.(false);
    } catch (error) {
      console.error(error);
      toast.error("Đã có lỗi xảy ra");
    } finally {
      setIsLoading(false);
    }
  };

  const defaultTrigger = resource ? (
    <Button
      variant="ghost"
      size="icon"
      className="min-w-[44px] min-h-[44px]"
      aria-label="Chỉnh sửa tài nguyên"
      disabled={isLoading}
    >
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button size="sm" className="text-xs">
      <Plus className="mr-2 h-3.5 w-3.5" />
      Thêm tài nguyên
    </Button>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger || defaultTrigger}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-semibold text-foreground">
                    {resource ? "Chỉnh sửa tài nguyên" : "Thêm tài nguyên mới"}
                </SheetTitle>
            </div>
            <SheetDescription className="text-muted-foreground text-sm">
              {resource
                ? "Cập nhật thông tin chi tiết cho tài nguyên này."
                : "Điền thông tin để tạo tài nguyên mới vào hệ thống."}
            </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 [scrollbar-gutter:stable]">
          <ResourceForm
            defaultValues={resource}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
