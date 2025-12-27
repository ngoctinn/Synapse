  import { ResourceGroup } from "@/features/resources";
import { useSheetForm } from "@/shared/hooks";
import {
  Button,
  Form,
  SheetClose,
} from "@/shared/ui";
import { ActionSheet, Icon } from "@/shared/ui/custom";
import { Group, Stack } from "@/shared/ui/layout";
import { Save, Send } from "lucide-react";
import { useCallback } from "react";
import { createService, updateService } from "../actions";
import { SERVICE_DEFAULT_VALUES } from "../constants";
import { MOCK_RESOURCE_GROUPS } from "../model/mocks";
import { ServiceFormValues, serviceSchema } from "../model/schemas";
import { Service, ServiceCategory, Skill } from "../model/types";
import { ServiceForm } from "./service-form";

  interface ServiceSheetProps {
    mode: "create" | "update";
    initialData?: Service;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    availableSkills: Skill[];
    availableCategories: ServiceCategory[];
    availableResourceGroups?: ResourceGroup[];
  }

  export function ServiceSheet({
    mode,
    initialData,
    open,
    onOpenChange,
    availableSkills,
    availableCategories,
    availableResourceGroups = MOCK_RESOURCE_GROUPS,
  }: ServiceSheetProps) {
    const isUpdateMode = mode === "update";

    // Transform Service entity to form values
    const transformData = useCallback(
      (service: Service): Partial<ServiceFormValues> => ({
        name: service.name || "",
        duration: service.duration || SERVICE_DEFAULT_VALUES.duration,
        buffer_time: service.buffer_time || SERVICE_DEFAULT_VALUES.buffer_time,
        price: service.price || SERVICE_DEFAULT_VALUES.price,
        is_active: service.is_active ?? false,
        image_url: service.image_url || "",
        color: service.color || SERVICE_DEFAULT_VALUES.color,
        description: service.description || "",
        // Cast the array to ensure type safety, though it should match if schemas are aligned
        resource_requirements: service.resource_requirements || [],
        skill_ids: service.skills?.map((s) => s.id) || [],
        new_skills: [],
        category_id: service.category_id || undefined,
      }),
      []
    );

    // Action wrapper to adapt for useSheetForm API
    const handleAction = useCallback(
      async (data: ServiceFormValues) => {
        // Clean up empty usage_duration
        const cleanData = {
            ...data,
            resource_requirements: data.resource_requirements.map(req => ({
              ...req,
              usage_duration: req.usage_duration || undefined
            }))
        };

        if (isUpdateMode && initialData) {
          return updateService(initialData.id, cleanData);
        }
        return createService(cleanData);
      },
      [isUpdateMode, initialData]
    );

    const { form, isPending, onSubmit, isDirty } = useSheetForm({
      schema: serviceSchema,
      defaultValues: {
        name: "",
        duration: SERVICE_DEFAULT_VALUES.duration,
        buffer_time: SERVICE_DEFAULT_VALUES.buffer_time,
        price: SERVICE_DEFAULT_VALUES.price,
        is_active: false,
        image_url: "",
        color: SERVICE_DEFAULT_VALUES.color,
        description: "",
        resource_requirements: [],
        skill_ids: [],
        new_skills: [],
      },
      open,
      data: initialData,
      transformData,
      action: handleAction,
      onSuccess: () => onOpenChange(false),
      toastMessages: {
        success: isUpdateMode
          ? "Cập nhật dịch vụ thành công"
          : "Tạo dịch vụ thành công",
        error: isUpdateMode
          ? "Không thể cập nhật dịch vụ"
          : "Không thể tạo dịch vụ",
      },
    });

    return (
      <ActionSheet
        open={open}
        onOpenChange={onOpenChange}
        title={isUpdateMode ? "Chỉnh sửa dịch vụ" : "Tạo dịch vụ mới"}
        description={
          isUpdateMode
            ? "Chỉnh sửa thông tin dịch vụ"
            : "Tạo dịch vụ mới cho spa"
        }
        isPending={isPending}
        isDirty={isDirty}
        footer={
          <Group justify="end" gap={2} className="w-full">
            <SheetClose asChild>
              <Button
                variant="outline"
                disabled={isPending}
              >
                Hủy
              </Button>
            </SheetClose>
            <Button
              type="submit"
              form="service-form"
              isLoading={isPending}
              startContent={<Icon icon={isUpdateMode ? Save : Send} />}
            >
              {isUpdateMode ? "Lưu thay đổi" : "Tạo dịch vụ"}
            </Button>
          </Group>
        }
      >
        <Form {...form}>
          <Stack
            gap={0}
            asChild
            className="h-full"
          >
             <form
              id="service-form"
              onSubmit={onSubmit}
            >
              <ServiceForm
                mode={mode}
                availableSkills={availableSkills}
                availableCategories={availableCategories}
                availableResourceGroups={availableResourceGroups}
                className="flex-1"
              />
            </form>
          </Stack>
        </Form>
      </ActionSheet>
    );
  }
