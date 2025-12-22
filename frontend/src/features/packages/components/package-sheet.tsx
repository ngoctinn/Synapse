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
import { packageSchema, PackageFormValues } from "../schemas";
import { ServicePackage } from "../types";
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
      <SheetContent className="w-full sm:max-w-lg p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b shrink-0 space-y-0">
          <SheetTitle className="text-lg font-semibold text-foreground">
            {isUpdateMode ? "Chỉnh sửa gói dịch vụ" : "Tạo gói dịch vụ mới"}
          </SheetTitle>
        </SheetHeader>

        <div className="sheet-scroll-area">
          <Form {...form}>
            <form
              id="package-form"
              onSubmit={onSubmit}
              className="h-full flex flex-col"
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
