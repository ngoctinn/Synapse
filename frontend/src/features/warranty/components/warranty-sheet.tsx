"use client";

import { MOCK_TREATMENTS } from "@/features/treatments/model/mocks";
import { useSheetForm } from "@/shared/hooks/use-sheet-form";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SheetClose,
  Textarea,
} from "@/shared/ui";
import { Stack } from "@/shared/ui/layout";
import { NumberInput } from "@/shared/ui/custom/number-input";
import { ActionSheet } from "@/shared/ui/custom";
import { createWarranty, updateWarranty } from "../actions";
import { warrantyCreateSchema, WarrantyFormValues } from "../model/schemas";
import { WarrantyTicket } from "../model/types";

interface WarrantySheetProps {
  mode: "create";
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WarrantySheet({
  mode,
  open,
  onOpenChange,
}: WarrantySheetProps) {
  const { form, isPending, onSubmit, isDirty } = useSheetForm<
    WarrantyFormValues,
    WarrantyTicket
  >({
    schema: warrantyCreateSchema,
    defaultValues: {
      customer_id: "",
      treatment_id: "",
      duration_months: 6,
      terms:
        "Bảo hành kết quả điều trị trong thời hạn quy định. Không áp dụng nếu khách hàng không tuân thủ hướng dẫn chăm sóc.",
    },
    open,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: (mode === "create" ? createWarranty : updateWarranty) as any,
    onSuccess: () => onOpenChange(false),
    toastMessages: {
      success: "Đã tạo phiếu bảo hành",
    },
  });

  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title="Tạo phiếu bảo hành mới"
      description="Tạo phiếu bảo hành cho liệu trình điều trị"
      isPending={isPending}
      isDirty={isDirty}
      footer={
        <>
          <SheetClose asChild>
              <Button variant="outline" disabled={isPending}>
                Hủy
              </Button>
          </SheetClose>
          <Button type="submit" form="warranty-form" isLoading={isPending}>
            Tạo phiếu
          </Button>
        </>
      }
    >
      <Form {...form}>
        <Stack id="warranty-form" onSubmit={onSubmit} gap={6} asChild>
          <form>
            <Stack gap={4}>
            <FormField
              control={form.control}
              name="customer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Khách hàng</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn khách hàng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Array.from(
                        new Set(
                          MOCK_TREATMENTS.map((t) =>
                            JSON.stringify({
                              id: t.customer_id,
                              name: t.customer_name,
                            })
                          )
                        )
                      )
                        .map((s) => JSON.parse(s))
                        .map((c: { id: string; name: string }) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="treatment_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Liệu trình áp dụng</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn liệu trình" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_TREATMENTS.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.package_name} - {t.customer_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration_months"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Thời hạn (tháng)</FormLabel>
                  <FormControl>
                    <NumberInput min={1} {...field} suffix="tháng" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Điều khoản bảo hành</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập điều khoản chi tiết..."
                      rows={6}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </Stack>
          </form>
        </Stack>
      </Form>
    </ActionSheet>
  );
}
