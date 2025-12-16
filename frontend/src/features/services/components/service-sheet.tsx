"use client";

import { Resource, RoomType } from "@/features/resources";
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
import { Save, Send } from "lucide-react";
import * as React from "react";
import { Resolver, useForm } from "react-hook-form";
import { createService, updateService } from "../actions";
import { SERVICE_DEFAULT_VALUES } from "../constants";
import { MOCK_CATEGORIES } from "../data/mocks";
import { ServiceFormValues, serviceSchema } from "../schemas";
import { Service, Skill } from "../types";
import { ServiceForm } from "./service-form";

interface ServiceSheetProps {
  mode: "create" | "update";
  initialData?: Service;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableSkills: Skill[];
  availableRoomTypes: RoomType[];
  availableEquipment: Resource[];
}

export function ServiceSheet({
  mode,
  initialData,
  open,
  onOpenChange,
  availableSkills,
  availableRoomTypes,
  availableEquipment,
}: ServiceSheetProps) {
  const [isPending, startTransition] = React.useTransition();
  const isUpdateMode = mode === "update";

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as Resolver<ServiceFormValues>,
    mode: "onChange",
    disabled: isPending,
    defaultValues: {
      name: initialData?.name || "",
      duration: initialData?.duration || SERVICE_DEFAULT_VALUES.duration,
      buffer_time:
        initialData?.buffer_time || SERVICE_DEFAULT_VALUES.buffer_time,
      price: initialData?.price || SERVICE_DEFAULT_VALUES.price,
      is_active: initialData?.is_active ?? true,
      image_url: initialData?.image_url || "",
      color: initialData?.color || SERVICE_DEFAULT_VALUES.color,
      description: initialData?.description || "",
      resource_requirements: {
        room_type_id:
          initialData?.resource_requirements?.room_type_id || undefined,
        equipment_ids: initialData?.resource_requirements?.equipment_ids || [],
        equipment_usage:
          initialData?.resource_requirements?.equipment_usage || [],
      },
      skill_ids: initialData?.skills?.map((s) => s.id) || [],
      new_skills: [],
    },
  });

  // Reset form when opening
  React.useEffect(() => {
    if (open) {
      form.reset({
        name: initialData?.name || "",
        duration: initialData?.duration || SERVICE_DEFAULT_VALUES.duration,
        buffer_time:
          initialData?.buffer_time || SERVICE_DEFAULT_VALUES.buffer_time,
        price: initialData?.price || SERVICE_DEFAULT_VALUES.price,
        is_active: initialData?.is_active ?? true,
        image_url: initialData?.image_url || "",
        color: initialData?.color || SERVICE_DEFAULT_VALUES.color,
        description: initialData?.description || "",
        resource_requirements: {
          room_type_id:
            initialData?.resource_requirements?.room_type_id || undefined,
          equipment_ids:
            initialData?.resource_requirements?.equipment_ids || [],
          equipment_usage:
            initialData?.resource_requirements?.equipment_usage || [],
        },
        skill_ids: initialData?.skills?.map((s) => s.id) || [],
        new_skills: [],
      });
    }
  }, [open, initialData, form]);

  const onSubmit = (data: ServiceFormValues) => {
    startTransition(async () => {
      try {
        const result =
          isUpdateMode && initialData
            ? await updateService(initialData.id, data)
            : await createService(data);

        if (result.status === "success") {
          showToast.success(
            isUpdateMode ? "Cập nhật thành công" : "Tạo dịch vụ thành công",
            `Dịch vụ "${data.name}" đã được ${
              isUpdateMode ? "cập nhật" : "thêm vào hệ thống"
            }.`
          );
          onOpenChange(false);
        } else {
          showToast.error("Thất bại", result.message);
        }
      } catch {
        showToast.error(
          "Lỗi hệ thống",
          "Đã có lỗi xảy ra, vui lòng thử lại sau."
        );
      }
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b shrink-0 space-y-0">
          <SheetTitle className="text-lg font-semibold text-foreground">
            {isUpdateMode ? "Chỉnh sửa dịch vụ" : "Tạo dịch vụ mới"}
          </SheetTitle>
        </SheetHeader>

        <div className="sheet-scroll-area">
          <Form {...form}>
            <form
              id="service-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="h-full flex flex-col"
            >
              <ServiceForm
                mode={mode}
                availableSkills={availableSkills}
                availableRoomTypes={availableRoomTypes}
                availableEquipment={availableEquipment}
                availableCategories={MOCK_CATEGORIES}
                className="flex-1"
              />
            </form>
          </Form>
        </div>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            type="submit"
            form="service-form"
            isLoading={isPending}
            className="min-w-[140px]"
            startContent={
              isUpdateMode ? (
                <Save className="size-4" />
              ) : (
                <Send className="size-4" />
              )
            }
          >
            {isUpdateMode ? "Lưu thay đổi" : "Tạo dịch vụ"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
