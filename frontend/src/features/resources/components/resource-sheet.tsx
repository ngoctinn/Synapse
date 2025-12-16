"use client";

import {
    Button,
    Form,
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    showToast
} from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { manageResource } from "../actions";
import { ResourceFormValues, resourceSchema } from "../schemas";
import { Resource, ResourceGroup } from "../types";
import { ResourceForm } from "./resource-form";

interface ResourceSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update";
  resource?: Resource;
  groups: ResourceGroup[];
}

export function ResourceSheet({
  open,
  onOpenChange,
  mode,
  resource,
  groups,
}: ResourceSheetProps) {
  const [state, dispatch, isPending] = React.useActionState(
    manageResource,
    undefined
  );

  const form = useForm<ResourceFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(resourceSchema) as any,
    disabled: isPending,
    defaultValues: getDefaultResourceValues("create"),
  });

  React.useEffect(() => {
    if (open) {
      if (mode === "create") {
        form.reset(getDefaultResourceValues("create"));
      } else if (resource) {
        form.reset(getDefaultResourceValues("update", resource));
      }
    }
  }, [open, mode, resource, form]);

  React.useEffect(() => {
    if (state?.status === "success" && state.message) {
      showToast.success(
        mode === "update" ? "Cập nhật thành công" : "Tạo mới thành công",
        state.message
      );
      onOpenChange(false);
    } else if (state?.status === "error") {
      showToast.error("Thất bại", state.message);
    }
  }, [state, mode, onOpenChange]);

  const onSubmit = (data: ResourceFormValues) => {
    const formData = new FormData();
    if (mode === "update" && resource?.id) {
      formData.append("id", resource.id);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (key === "tags") {
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
    <Sheet open={open} onOpenChange={(val) => !isPending && onOpenChange(val)}>
      <SheetContent className="w-full sm:max-w-lg p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b shrink-0 space-y-0">
          <SheetTitle className="text-lg font-semibold text-foreground">
            {mode === "update"
              ? "Chỉnh sửa tài nguyên"
              : "Thêm tài nguyên mới"}
          </SheetTitle>
        </SheetHeader>

        <div className="sheet-scroll-area">
          <Form {...form}>
            <form
              id="resource-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <ResourceForm mode={mode} groups={groups} />
            </form>
          </Form>
        </div>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => !isPending && onOpenChange?.(false)}
            disabled={isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="resource-form"
            isLoading={isPending}
            className="min-w-[140px]"
            startContent={<Save className="size-4" />}
          >
            {resource ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function getDefaultResourceValues(
  mode: "create" | "update",
  resource?: Resource
): ResourceFormValues {
  if (mode === "update" && resource) {
    return {
      ...resource,
      groupId: resource.groupId,
      setupTime: resource.setupTime ?? 0,
      capacity: resource.capacity ?? 1,
      tags: resource.tags ?? [],
    };
  }

  return {
    name: "",
    code: "",
    groupId: "",
    type: "ROOM",
    status: "ACTIVE",
    capacity: 1,
    setupTime: 0,
    description: "",
    tags: [],
  };
}
