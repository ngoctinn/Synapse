import { cn } from "@/shared/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Crown, Save, UserPlus } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";

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

import {
  Badge,
  Button,
  Form,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  showToast,
} from "@/shared/ui";
import { FormTabs, FormTabsContent } from "@/shared/ui/custom/form-tabs";

import { CustomerForm } from "./customer-form";
import { CustomerHistory } from "./customer-history";

interface CustomerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "update";
  customer?: Customer;
}

// Remove unused initialState object

export function CustomerSheet({
  open,
  onOpenChange,
  mode,
  customer,
}: CustomerSheetProps) {
  const [state, dispatch, isPending] = React.useActionState(
    manageCustomer,
    undefined
  );
  const [technicians, setTechnicians] = React.useState<TechnicianOption[]>([]);

  const schema = mode === "create" ? customerSchema : customerUpdateSchema;

  // Fetch danh sách kỹ thuật viên cho dropdown "Chuyên viên ưu tiên"
  React.useEffect(() => {
    if (open) {
      getTechnicians().then(setTechnicians);
    }
  }, [open]);

  const form = useForm<CustomerFormValues | CustomerUpdateFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    disabled: isPending,
    defaultValues: {
      full_name: "",
      email: "",
      phone_number: "",
      gender: undefined,
      date_of_birth: "",
      address: "",
      membership_tier: "SILVER",
      loyalty_points: 0,
    },
  });

  React.useEffect(() => {
    if (state?.status === "success" && state.message) {
      showToast.success(
        mode === "create" ? "Tạo thành công" : "Cập nhật thành công",
        state.message
      );
      onOpenChange(false);
    } else if (state?.status === "error") {
      showToast.error("Thất bại", state.message);
    }
  }, [state, mode, onOpenChange]);

  React.useEffect(() => {
    if (open) {
      if (mode === "update" && customer) {
        form.reset({
          id: customer.id,
          full_name: customer.full_name,
          email: customer.email || "",
          phone_number: customer.phone_number || "",
          gender: customer.gender || undefined,
          date_of_birth: customer.date_of_birth || "",
          address: customer.address || "",
          allergies: customer.allergies || "",
          medical_notes: customer.medical_notes || "",
          membership_tier: customer.membership_tier || "SILVER",
          loyalty_points: customer.loyalty_points || 0,
          preferred_staff_id: customer.preferred_staff_id || undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);
      } else {
        form.reset({
          full_name: "",
          email: "",
          phone_number: "",
          gender: undefined,
          date_of_birth: "",
          address: "",
          allergies: "",
          medical_notes: "",
          membership_tier: "SILVER",
          loyalty_points: 0,
        });
      }
    }
  }, [open, mode, customer, form]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (data: any) => {
    const formData = new FormData();
    formData.append("form_mode", mode);
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    React.startTransition(() => {
      dispatch(formData);
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(
          "w-full p-0 gap-0 flex flex-col bg-background border-l shadow-2xl transition-all duration-300",
          mode === "update" ? "sm:max-w-3xl" : "sm:max-w-lg"
        )}
      >
        <SheetHeader className="px-6 py-4 border-b shrink-0 space-y-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold text-foreground flex items-center gap-3">
              {mode === "create" ? "Thêm khách hàng mới" : "Hồ sơ khách hàng"}
            </SheetTitle>
            <div className="flex items-center gap-2">
              {mode === "update" && customer?.allergies && (
                <Badge variant="destructive" size="sm">
                  <AlertCircle className="size-3.5" />
                  Dị ứng
                </Badge>
              )}
              {mode === "update" && customer?.membership_tier === "GOLD" && (
                <Badge preset="tier-gold">
                  <Crown className="size-3.5" />
                  Gold
                </Badge>
              )}
              {mode === "update" &&
                customer?.membership_tier === "PLATINUM" && (
                  <Badge preset="tier-platinum">
                    <Crown className="size-3.5" />
                    Platinum
                  </Badge>
                )}
            </div>
          </div>
        </SheetHeader>

        <div className="sheet-scroll-area" id="sheet-scroll-container">
          <Form {...form}>
            <form
              id="customer-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              {mode === "create" ? (
                <CustomerForm
                  mode={mode}
                  disabled={isPending}
                  technicians={technicians}
                />
              ) : (
                <FormTabs
                  tabs={[
                    { value: "info", label: "Thông tin" },
                    { value: "history", label: "Lịch sử & Thống kê" },
                  ]}
                  defaultValue="info"
                >
                  <FormTabsContent
                    value="info"
                    className="form-tab-enter mt-0 space-y-6"
                  >
                    <CustomerForm
                      mode={mode}
                      disabled={isPending}
                      technicians={technicians}
                    />
                  </FormTabsContent>
                  <FormTabsContent
                    value="history"
                    className="form-tab-enter mt-0"
                  >
                    <CustomerHistory />
                  </FormTabsContent>
                </FormTabs>
              )}
            </form>
          </Form>
        </div>

        <SheetFooter className="z-20">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Hủy bỏ
          </Button>
          {/* Display save button only if not in History tab? Actually we can keep it, but it submits the form.
                If user is in History tab, they might still want to save form changes.
                However, to avoid confusion, maybe we should only show specific actions.
                For now, keep simple: Save always saves the Info form.
            */}
          <Button
            type="submit"
            form="customer-form"
            disabled={isPending}
            className="min-w-[140px]"
            isLoading={isPending}
            startContent={
              mode === "create" ? (
                <UserPlus className="size-4" />
              ) : (
                <Save className="size-4" />
              )
            }
          >
            {mode === "create" ? "Tạo hồ sơ" : "Lưu thay đổi"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
