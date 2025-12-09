"use client";

import { Button } from "@/shared/ui/button";
import { showToast } from "@/shared/ui/custom/sonner";
import { Form } from "@/shared/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, Plus, Save } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { manageResource } from "../actions";
import { ResourceFormValues, resourceSchema } from "../schemas";
import { Resource } from "../types";
import { ResourceForm } from "./resource-form";

interface ResourceSheetProps {
  resource?: Resource;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const initialState = {
  success: false,
  message: "",
  error: "",
}

export function ResourceSheet({
  resource,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: ResourceSheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? controlledOnOpenChange : setInternalOpen;

  const [state, dispatch, isPending] = React.useActionState(manageResource, initialState);

  const form = useForm<ResourceFormValues>({
    resolver: zodResolver(resourceSchema) as any,
    defaultValues: {
      name: "",
      code: "",
      type: "ROOM",
      status: "ACTIVE",
      capacity: 1,
      setupTime: 0,
      description: "",
      tags: [],
    },
  });

  // Reset form when opening or when resource changes
  React.useEffect(() => {
    if (open) {
      form.reset(resource ? {
        ...resource,
        setupTime: resource.setupTime ?? 0,
        capacity: resource.capacity ?? 1,
        tags: resource.tags ?? [],
      } : {
        name: "",
        code: "",
        type: "ROOM",
        status: "ACTIVE",
        capacity: 1,
        setupTime: 0,
        description: "",
        tags: [],
      });
    }
  }, [open, resource, form]);

  // Handle server action response
  React.useEffect(() => {
    if (state.success && state.message) {
      showToast.success(resource ? "Cập nhật thành công" : "Tạo mới thành công", state.message);
      onOpenChange?.(false);
    } else if (state.error) {
      showToast.error("Thất bại", state.error);
    }
  }, [state, resource, onOpenChange]);

  const onSubmit = (data: ResourceFormValues) => {
    const formData = new FormData();
    if (resource?.id) formData.append("id", resource.id);

    Object.entries(data).forEach(([key, value]) => {
      if (key === 'tags') {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    React.startTransition(() => {
      dispatch(formData);
    });
  };

  const defaultTrigger = resource ? (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 p-0"
      aria-label="Chỉnh sửa"
    >
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button size="sm" className="text-xs shadow-sm">
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
          <Form {...form}>
            <form id="resource-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ResourceForm />
            </form>
          </Form>
        </div>

        <SheetFooter className="px-6 py-4 border-t sm:justify-between flex-row items-center gap-4 bg-background">
            <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange?.(false)}
                className="text-muted-foreground hover:text-foreground"
            >
                Hủy bỏ
            </Button>
            <Button
                type="submit"
                form="resource-form"
                disabled={isPending}
                className="min-w-[140px] shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
            >
                {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <>
                        <Save className="mr-2 h-4 w-4" />
                        {resource ? "Lưu thay đổi" : "Tạo mới"}
                    </>
                )}
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
