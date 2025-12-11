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
    SheetTitle
} from "@/shared/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { manageResource } from "../actions";
import { ResourceFormValues, resourceSchema } from "../schemas";
import { Resource, ResourceGroup } from "../types";
import { ResourceForm } from "./resource-form";

interface ResourceSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "update"
  resource?: Resource
  groups: ResourceGroup[]
}

const initialState = {
  success: false,
  message: "",
  error: "",
}

export function ResourceSheet({
  open,
  onOpenChange,
  mode,
  resource,
  groups,
}: ResourceSheetProps) {
  const [state, dispatch, isPending] = React.useActionState(manageResource, initialState);

  const form = useForm<ResourceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(resourceSchema) as any,
    defaultValues: {
      name: "",
      code: "",
      groupId: "", // Default empty
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
      if (mode === "create") {
         form.reset({
            name: "",
            code: "",
            groupId: "",
            type: "ROOM",
            status: "ACTIVE",
            capacity: 1,
            setupTime: 0,
            description: "",
            tags: [],
         });
      } else if (resource) {
         form.reset({
            ...resource,
            groupId: resource.groupId || "",
            setupTime: resource.setupTime ?? 0,
            capacity: resource.capacity ?? 1,
            tags: resource.tags ?? [],
         });
      }
    }
  }, [open, mode, resource, form]);


  React.useEffect(() => {
    if (state.success && state.message) {
      showToast.success(mode === "update" ? "Cập nhật thành công" : "Tạo mới thành công", state.message);
      onOpenChange(false);
    } else if (state.error) {
      showToast.error("Thất bại", state.error);
    }
  }, [state, mode, onOpenChange]);

  const onSubmit = (data: ResourceFormValues) => {
    const formData = new FormData();
    // Pass hidden fields for server action to identify mode/ID
    if (mode === "update" && resource?.id) {
        formData.append("id", resource.id);
    }

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
                <SheetTitle className="text-xl font-semibold text-foreground">
                    {mode === "update" ? "Chỉnh sửa tài nguyên" : "Thêm tài nguyên mới"}
                </SheetTitle>
            </div>
            <SheetDescription className="text-muted-foreground text-sm">
              {mode === "update"
                ? "Cập nhật thông tin chi tiết cho tài nguyên này."
                : "Điền thông tin để tạo tài nguyên mới vào hệ thống."}
            </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 [scrollbar-gutter:stable]">
          <Form {...form}>
            <form id="resource-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ResourceForm mode={mode} groups={groups} />
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
                isLoading={isPending}
                className="min-w-[140px]"
                startContent={<Save className="h-4 w-4" />}
            >
                {resource ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
