"use client";

import { useSheetForm } from "@/shared/hooks/use-sheet-form";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { createWarranty, updateWarranty } from "../actions";
import { warrantyCreateSchema, WarrantyFormValues } from "../model/schemas";
import { WarrantyTicket } from "../model/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { MOCK_TREATMENTS } from "@/features/treatments/model/mocks";

interface WarrantySheetProps {
  mode: "create"; // Only create implemented for now
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WarrantySheet({
  mode,
  open,
  onOpenChange,
}: WarrantySheetProps) {
  const { form, isPending, onSubmit } = useSheetForm<
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

  // Removed useEffect reset logic as hook handles it

  // Removed manual onSubmit and handleSubmit usage since we use the hook's onSubmit directly

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex h-full w-full flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Tạo phiếu bảo hành mới</SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="mt-6 flex flex-1 flex-col gap-6 overflow-y-auto px-1"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Khách hàng <span className="text-destructive">*</span>
                    </FormLabel>
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
                        {/* Mock unique customers from treatments */}
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
                    <FormLabel>
                      Liệu trình áp dụng{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
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
                    <FormLabel>
                      Thời hạn (tháng){" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
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
                    <FormLabel>
                      Điều khoản bảo hành{" "}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập điều khoản chi tiết..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="mt-auto pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isPending}>
                Tạo phiếu
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
