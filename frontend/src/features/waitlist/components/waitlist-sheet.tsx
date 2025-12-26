  "use client";

  import { createWaitlistEntry, updateWaitlistEntry } from "../actions";
  import {
    waitlistCreateSchema,
    type WaitlistFormValues,
  } from "../model/schemas";
  import { WaitlistEntry } from "../model/types";
  import { MOCK_SERVICES } from "@/features/services/model/mocks";
  import { useSheetForm } from "@/shared/hooks/use-sheet-form";
  import {
    Button,
    DatePicker,
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
  import { cn } from "@/shared/lib/utils";
  import { format, parse } from "date-fns";
  import { vi } from "date-fns/locale";
  import { ActionSheet } from "@/shared/ui/custom";
  import { Stack, Grid } from "@/shared/ui/layout";

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

    const { form, isPending, onSubmit, isDirty } = useSheetForm<
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
        ...defaultValues,
      },
      open,
      data,
      transformData: (entry) => ({
        ...entry,
        customer_id: entry.customer_id,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      action: (isCreate ? createWaitlistEntry : updateWaitlistEntry) as any,
      onSuccess: () => onOpenChange(false),
      toastMessages: {
        success: isCreate ? "Đã thêm vào danh sách chờ" : "Đã cập nhật yêu cầu",
      },
    });

    return (
      <ActionSheet
        open={open}
        onOpenChange={onOpenChange}
        title={isCreate ? "Thêm vào danh sách chờ" : "Chi tiết yêu cầu"}
        description={
          isCreate
            ? "Thêm khách hàng vào danh sách chờ"
            : "Xem và chỉnh sửa yêu cầu"
        }
        isPending={isPending}
        isDirty={isDirty}
        footer={
          <>
            <SheetClose asChild>
              <Button variant="outline" disabled={isPending}>
                Hủy
              </Button>
            </SheetClose>
            <Button
              type="submit"
              form="waitlist-form"
              isLoading={isPending}
            >
              {isCreate ? "Gửi yêu cầu" : "Lưu thay đổi"}
            </Button>
          </>
        }
      >
        <Form {...form}>
          <Stack id="waitlist-form" onSubmit={onSubmit} gap={6} asChild>
            <form>
              <Stack gap={4}>
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

              <Grid cols={2} gap={4}>
                <FormField
                  control={form.control}
                  name="preferred_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày mong muốn</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                          onChange={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                          placeholder="Chọn ngày"
                          modal={true}
                        />
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
              </Grid>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ghi chú thêm..."
                        rows={4}
                        {...field}
                        value={field.value || ""}
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
