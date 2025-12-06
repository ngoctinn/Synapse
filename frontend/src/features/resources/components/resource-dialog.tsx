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
import { Edit, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createResource, updateResource } from "../actions";
import { ResourceFormValues } from "../model/schema";
import { Resource } from "../model/types";
import { ResourceForm } from "./resource-form";

interface ResourceDialogProps {
  resource?: Resource; // If provided, existing resource to edit
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ResourceDialog({
  resource,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ResourceDialogProps) {
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
    <Button variant="ghost" size="icon" aria-label="Chỉnh sửa tài nguyên" disabled={isLoading}>
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <Plus className="mr-2 h-4 w-4" />
      Thêm tài nguyên
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {resource ? "Chỉnh sửa tài nguyên" : "Thêm tài nguyên mới"}
          </DialogTitle>
          <DialogDescription>
            {resource
              ? "Cập nhật thông tin chi tiết cho tài nguyên này."
              : "Điền thông tin để tạo tài nguyên mới vào hệ thống."}
          </DialogDescription>
        </DialogHeader>
        <ResourceForm
          defaultValues={resource}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
