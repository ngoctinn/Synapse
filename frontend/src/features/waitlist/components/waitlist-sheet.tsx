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
import { createWaitlistEntry, updateWaitlistEntry } from "../actions";
import {
  waitlistCreateSchema,
  type WaitlistFormValues,
} from "../model/schemas";
import { WaitlistEntry } from "../model/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { MOCK_SERVICES } from "@/features/services/model/mocks"; // Import mock services for dropdown

interface WaitlistSheetProps {
  mode: "create" | "edit";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data?: WaitlistEntry;
  defaultValues?: Partial<WaitlistFormValues>;
}

export function WaitlistSheet({
  mode,
  open,
  onOpenChange,
  data,
  defaultValues,
}: WaitlistSheetProps) {
  const isCreate = mode === "create";

  const { form, isPending, onSubmit } = useSheetForm<
    WaitlistFormValues,
    WaitlistEntry
  >({
    schema: waitlistCreateSchema,
    defaultValues: {
      customer_id: "",
      customer_name: "",
      phone_number: "",
      service_id: "",
      preferred_date: new Date().toISOString().split("T")[0],
      preferred_time_slot: "",
      notes: "",
      ...defaultValues, // Allow overrides
    },
    open,
    data,
    transformData: (entry) => ({
      ...entry,
      customer_id: entry.customer_id, // Ensure all fields mapped
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    action: (mode === "create"
      ? createWaitlistEntry
      : updateWaitlistEntry) as any,
    onSuccess: () => onOpenChange(false),
    toastMessages: {
      success: isCreate ? "Đã thêm vào danh sách chờ" : "Đã cập nhật yêu cầu",
    },
  });

  // Removed useEffect reset logic as hook handles it

  // The onSubmit function is now returned by useSheetForm and handles the action.
  // The local onSubmit logic is integrated into the useSheetForm hook's behavior.
  // For edit mode, you would typically pass an update action to useSheetForm.
  // Since the instruction only shows the create path for the action,
  // and the original code had a placeholder for edit, we'll keep the edit placeholder
  // but note that `onSubmit` from `useSheetForm` is primarily for the `action` provided.
  // onSubmit is handled by hook
  // const onSubmit = ... removed

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background flex w-full flex-col gap-0 border-l p-0 shadow-2xl sm:max-w-lg">
        <SheetHeader className="shrink-0 space-y-0 border-b px-6 py-4">
          <SheetTitle className="text-foreground text-lg font-semibold">
            {isCreate ? "Thêm vào danh sách chờ" : "Chi tiết yêu cầu"}
          </SheetTitle>
        </SheetHeader>

        <div className="sheet-scroll-area">

        <Form {...form}>
          <form
            onSubmit={onSubmit}
            className="mt-6 flex flex-1 flex-col gap-6 overflow-y-auto px-1"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="customer_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Tên khách hàng</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên khách hàng" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="09xxxx..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="service_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Dịch vụ quan tâm</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn dịch vụ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOCK_SERVICES.map((s) => (
                          <SelectItem key={s.id} value={s.id}>
                            {s.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="preferred_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày mong muốn</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferred_time_slot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Khung giờ</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn khung giờ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Buổi sáng (9:00 - 12:00)">
                            Buổi sáng
                          </SelectItem>
                          <SelectItem value="Buổi chiều (13:00 - 17:00)">
                            Buổi chiều
                          </SelectItem>
                          <SelectItem value="Buổi tối (17:00 - 21:00)">
                            Buổi tối
                          </SelectItem>
                          <SelectItem value="Sau 17:00">Sau 17:00</SelectItem>
                          <SelectItem value="Cuối tuần">Cuối tuần</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ghi chú thêm..."
                        className="min-h-[100px]"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="mt-auto shrink-0 border-t p-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Hủy bỏ
              </Button>
              <Button type="submit" isLoading={isPending} disabled={isPending}>
                {isCreate ? "Gửi yêu cầu" : "Lưu thay đổi"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
