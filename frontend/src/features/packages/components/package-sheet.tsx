"use client";

import {
  Button,
  Form,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui";
import { useSheetForm } from "@/shared/hooks";
import { Save, Send } from "lucide-react";
import { useCallback } from "react";
import { createPackage, updatePackage } from "../actions";
import { packageSchema, PackageFormValues } from "../model/schemas";
import { ServicePackage } from "../model/types";
import { PackageForm } from "./package-form";

interface PackageSheetProps {
  mode: "create" | "update";
  initialData?: ServicePackage;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_VALUES: PackageFormValues = {
  name: "",
  description: "",
  price: 0,
  validity_days: 30,
  is_active: true,
  services: [],
};

export function PackageSheet({
  mode,
  initialData,
  open,
  onOpenChange,
}: PackageSheetProps) {
  const isUpdateMode = mode === "update";

  const transformData = useCallback(
    (pkg: ServicePackage): Partial<PackageFormValues> => ({
      name: pkg.name,
      description: pkg.description || "",
      price: pkg.price,
      validity_days: pkg.validity_days,
      is_active: pkg.is_active,
      services: pkg.services.map((s) => ({
        service_id: s.service_id,
        quantity: s.quantity,
      })),
    }),
    []
  );

  const handleAction = useCallback(
    async (data: PackageFormValues) => {
      if (isUpdateMode && initialData) {
        return updatePackage({ id: initialData.id, ...data });
      }
      return createPackage(data);
    },
    [isUpdateMode, initialData]
  );

  const { form, isPending, onSubmit } = useSheetForm({
    schema: packageSchema,
    defaultValues: DEFAULT_VALUES,
    open,
    data: initialData,
    transformData,
    action: handleAction,
    onSuccess: () => onOpenChange(false),
    toastMessages: {
      success: isUpdateMode ? "Cập nhật gói thành công" : "Tạo gói thành công",
      error: isUpdateMode ? "Không thể cập nhật gói" : "Không thể tạo gói",
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background flex w-full flex-col gap-0 border-l p-0 shadow-2xl sm:max-w-lg">
        <SheetHeader className="shrink-0 space-y-0 border-b px-6 py-4">
          <SheetTitle className="text-foreground text-lg font-semibold">
            {isUpdateMode ? "Chỉnh sửa gói dịch vụ" : "Tạo gói dịch vụ mới"}
          </SheetTitle>
        </SheetHeader>

        <div className="sheet-scroll-area">
          <Form {...form}>
            <form
              id="package-form"
              onSubmit={onSubmit}
              className="flex h-full flex-col"
            >
              <PackageForm mode={mode} className="flex-1" />
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
            form="package-form"
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
            {isUpdateMode ? "Lưu thay đổi" : "Tạo gói"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
