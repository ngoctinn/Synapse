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
} from "@/shared/ui";
import { Save, Send } from "lucide-react";
import { createService, updateService } from "../actions";
import { SERVICE_DEFAULT_VALUES } from "../constants";
import { MOCK_CATEGORIES } from "../model/mocks";
import { ServiceFormValues, serviceSchema } from "../model/schemas";
import { Service, Skill } from "../model/types";
import { ServiceForm } from "./service-form";
import { useSheetForm } from "@/shared/hooks";
import { useCallback } from "react";

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
  const isUpdateMode = mode === "update";

  // Transform Service entity thành form values
  const transformData = useCallback((service: Service): Partial<ServiceFormValues> => ({
    name: service.name || "",
    duration: service.duration || SERVICE_DEFAULT_VALUES.duration,
    buffer_time: service.buffer_time || SERVICE_DEFAULT_VALUES.buffer_time,
    price: service.price || SERVICE_DEFAULT_VALUES.price,
    is_active: service.is_active ?? true,
    image_url: service.image_url || "",
    color: service.color || SERVICE_DEFAULT_VALUES.color,
    description: service.description || "",
    resource_requirements: {
      room_type_id: service.resource_requirements?.room_type_id || undefined,
      equipment_ids: service.resource_requirements?.equipment_ids || [],
      equipment_usage: service.resource_requirements?.equipment_usage || [],
    },
    skill_ids: service.skills?.map((s) => s.id) || [],
    new_skills: [],
  }), []);

  // Action wrapper để phù hợp với useSheetForm API
  const handleAction = useCallback(async (data: ServiceFormValues) => {
    if (isUpdateMode && initialData) {
      return updateService(initialData.id, data);
    }
    return createService(data);
  }, [isUpdateMode, initialData]);

  const { form, isPending, onSubmit } = useSheetForm({
    schema: serviceSchema,
    defaultValues: {
      name: "",
      duration: SERVICE_DEFAULT_VALUES.duration,
      buffer_time: SERVICE_DEFAULT_VALUES.buffer_time,
      price: SERVICE_DEFAULT_VALUES.price,
      is_active: true,
      image_url: "",
      color: SERVICE_DEFAULT_VALUES.color,
      description: "",
      resource_requirements: {
        room_type_id: undefined,
        equipment_ids: [],
        equipment_usage: [],
      },
      skill_ids: [],
      new_skills: [],
    },
    open,
    data: initialData,
    transformData,
    action: handleAction,
    onSuccess: () => onOpenChange(false),
    toastMessages: {
      success: isUpdateMode ? "Cập nhật dịch vụ thành công" : "Tạo dịch vụ thành công",
      error: isUpdateMode ? "Không thể cập nhật dịch vụ" : "Không thể tạo dịch vụ",
    },
  });

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
              onSubmit={onSubmit}
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
