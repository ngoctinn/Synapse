"use client";

import { Save } from "lucide-react";
import * as React from "react";

import { useSheetForm } from "@/shared/hooks/use-sheet-form";
import { Button, Form, SheetClose } from "@/shared/ui";
import { ActionSheet, Icon } from "@/shared/ui/custom";
import { manageResource } from "../actions";
import { Resource, ResourceGroup } from "../model/types";
import { ResourceFormValues, resourceSchema } from "../schemas";
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
  const { form, isPending, onSubmit, isDirty } = useSheetForm<
    ResourceFormValues,
    Resource
  >({
    schema: resourceSchema,
    open,
    data: resource,
    defaultValues: {
      name: "",
      code: "",
      groupId: "",
      type: "ROOM",
      status: "ACTIVE",
      capacity: 1,
      setupTime: 0,
      description: "",
      tags: [],
    },
    transformData: (data) => ({
      ...data,
      groupId: data.groupId,
      setupTime: data.setupTime ?? 0,
      capacity: data.capacity ?? 1,
      tags: data.tags ?? [],
    }),
    action: async (values) => {
      const formData = new FormData();
      if (mode === "update" && resource?.id) {
        formData.append("id", resource.id);
      }

      Object.entries(values).forEach(([key, value]) => {
        if (key === "tags") {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      return manageResource(undefined, formData);
    },
    onSuccess: () => onOpenChange(false),
    toastMessages: {
      success: mode === "update" ? "Cập nhật thành công" : "Tạo mới thành công",
    },
  });

  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title={mode === "update" ? "Chỉnh sửa tài nguyên" : "Thêm tài nguyên mới"}
      description={
        mode === "update"
          ? "Chỉnh sửa thông tin tài nguyên"
          : "Thêm tài nguyên mới cho spa"
      }
      isPending={isPending}
      isDirty={isDirty}
      footer={
        <>
          <SheetClose asChild>
            <Button
              variant="outline"
              disabled={isPending}
              className="min-w-[100px]"
            >
              Hủy
            </Button>
          </SheetClose>
          <Button
            type="submit"
            form="resource-form"
            isLoading={isPending}
            className="min-w-[140px]"
            startContent={<Icon icon={Save} />}
          >
            {mode === "update" ? "Lưu thay đổi" : "Tạo mới"}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form id="resource-form" onSubmit={onSubmit} className="space-y-6">
          <ResourceForm mode={mode} groups={groups} />
        </form>
      </Form>
    </ActionSheet>
  );
}
