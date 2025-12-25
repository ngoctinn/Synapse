"use client";

import { Save, Send } from "lucide-react";
import * as React from "react";

import { useSheetForm } from "@/shared/hooks";
import { Button, Form, SheetClose } from "@/shared/ui";
import { ActionSheet, Icon } from "@/shared/ui/custom";
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

  const transformData = React.useCallback(
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

  const handleAction = React.useCallback(
    async (data: PackageFormValues) => {
      if (isUpdateMode && initialData) {
        return updatePackage({ id: initialData.id, ...data });
      }
      return createPackage(data);
    },
    [isUpdateMode, initialData]
  );

  const { form, isPending, onSubmit, isDirty } = useSheetForm({
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
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title={isUpdateMode ? "Chỉnh sửa gói dịch vụ" : "Tạo gói dịch vụ mới"}
      description={
        isUpdateMode
          ? "Chỉnh sửa thông tin gói dịch vụ"
          : "Tạo gói dịch vụ mới"
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
            form="package-form"
            isLoading={isPending}
            className="min-w-[140px]"
            startContent={<Icon icon={isUpdateMode ? Save : Send} />}
          >
            {isUpdateMode ? "Lưu thay đổi" : "Tạo gói"}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form
          id="package-form"
          onSubmit={onSubmit}
          className="flex h-full flex-col"
        >
          <PackageForm mode={mode} className="flex-1" />
        </form>
      </Form>
    </ActionSheet>
  );
}
