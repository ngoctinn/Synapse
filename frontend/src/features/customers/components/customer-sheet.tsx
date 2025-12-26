"use client";

import { AlertCircle, Save, UserPlus } from "lucide-react";
import * as React from "react";

import { manageCustomer } from "@/features/customers/actions";
import {
  CustomerFormValues,
  customerSchema,
  CustomerUpdateFormValues,
  customerUpdateSchema,
} from "@/features/customers/model/schemas";
import { Customer } from "@/features/customers/model/types";
import {
  getTechnicians,
  type TechnicianOption,
} from "@/features/staff/actions";
import { useSheetForm } from "@/shared/hooks/use-sheet-form";
import { Badge, Button, Form, SheetClose, Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";
import { ActionSheet, Icon } from "@/shared/ui/custom";
import { CustomerForm } from "./customer-form";
import { CustomerHistory } from "./customer-history";

interface CustomerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update";
  customer?: Customer;
}

export function CustomerSheet({
  open,
  onOpenChange,
  mode,
  customer,
}: CustomerSheetProps) {
  const [technicians, setTechnicians] = React.useState<TechnicianOption[]>([]);
  const schema = mode === "create" ? customerSchema : customerUpdateSchema;

  // Fetch danh sách kỹ thuật viên - giữ nguyên vì đây là domain logic cụ thể
  React.useEffect(() => {
    if (open) {
      getTechnicians().then(setTechnicians);
    }
  }, [open]);

  const { form, isPending, onSubmit, isDirty } = useSheetForm<
    CustomerFormValues | CustomerUpdateFormValues,
    Customer
  >({
    schema,
    open,
    data: customer,
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      gender: undefined,
      date_of_birth: "",
      address: "",
    },
    transformData: (data) => ({
      id: data.id,
      full_name: data.full_name,
      email: data.email || "",
      phone_number: data.phone_number || "",
      gender: data.gender || undefined,
      date_of_birth: data.date_of_birth || "",
      address: data.address || "",
      allergies: data.allergies || "",
      medical_notes: data.medical_notes || "",
      preferred_staff_id: data.preferred_staff_id || undefined,
    }),
    action: async (values) => {
      const formData = new FormData();
      formData.append("form_mode", mode);
      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        formData.append(key, String(value));
      });
      return manageCustomer(undefined, formData);
    },
    onSuccess: () => onOpenChange(false),
  });

  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title={
        <div className="flex items-center gap-3">
          {mode === "create" ? "Thêm khách hàng mới" : "Hồ sơ khách hàng"}
          {mode === "update" && customer?.allergies && (
            <Badge variant="destructive" size="sm">
              <Icon icon={AlertCircle} />
              Dị ứng
            </Badge>
          )}
        </div>
      }
      description={
        mode === "create"
          ? "Thêm khách hàng mới vào hệ thống"
          : "Xem và chỉnh sửa thông tin khách hàng"
      }
      isPending={isPending}
      isDirty={isDirty}
      footer={
        <>
          <SheetClose asChild>
            <Button variant="outline" disabled={isPending} className="min-w-[100px]">
              Hủy
            </Button>
          </SheetClose>
          <Button
            type="submit"
            form="customer-form"
            isLoading={isPending}
            className="min-w-[140px]"
            startContent={<Icon icon={mode === "create" ? UserPlus : Save} />}
          >
            {mode === "create" ? "Tạo hồ sơ" : "Lưu thay đổi"}
          </Button>
        </>
      }
    >
      <Form {...form}>
        <form id="customer-form" onSubmit={onSubmit} className="space-y-6">
          {mode === "create" ? (
            <CustomerForm
              mode={mode}
              disabled={isPending}
              technicians={technicians}
            />
          ) : (
            <Tabs defaultValue="info" className="flex h-full w-full flex-col">
              <TabsList className="mb-4 w-full grid grid-cols-2">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="history">Lịch sử & Thống kê</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="form-tab-enter mt-0 space-y-6">
                <CustomerForm
                  mode={mode}
                  disabled={isPending}
                  technicians={technicians}
                />
              </TabsContent>
              <TabsContent value="history" className="form-tab-enter mt-0">
                <CustomerHistory />
              </TabsContent>
            </Tabs>
          )}
        </form>
      </Form>
    </ActionSheet>
  );
}
