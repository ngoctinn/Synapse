"use client";

import { cn } from "@/shared/lib/utils";
import {
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Button,
  DatePicker,
} from "@/shared/ui";
import { format, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Stack, Grid } from "@/shared/ui/layout";

// Type cho danh sách KTV được truyền từ parent
export type TechnicianOption = {
  id: string;
  name: string;
};

interface CustomerFormProps {
  mode: "create" | "update";
  className?: string;
  disabled?: boolean;
  /** Danh sách kỹ thuật viên cho dropdown "Chuyên viên ưu tiên" */
  technicians?: TechnicianOption[];
}

export function CustomerForm({
  mode,
  className,
  disabled,
  technicians = [],
}: CustomerFormProps) {
  const form = useFormContext();

  // --- Sub-render functions (Extracted for readability) ---
  const renderProfile = () => (
    <Stack gap={6}>
      <Grid gap={4} className="grid-cols-1 md:grid-cols-2">
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Số điện thoại</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="0912 345 678"
                  autoFocus={mode === "create"}
                  disabled={disabled}
                  {...field}
                  className="font-medium"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel required>Họ và tên</FormLabel>
              <FormControl>
                <Input
                  placeholder="Nguyễn Văn A"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Grid>

      <Grid gap={4} className="grid-cols-1 md:grid-cols-2">
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giới tính</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Nam</SelectItem>
                  <SelectItem value="FEMALE">Nữ</SelectItem>
                  <SelectItem value="OTHER">Khác</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date_of_birth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngày sinh</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value && !isNaN(Date.parse(field.value)) ? parse(field.value, "yyyy-MM-dd", new Date()) : undefined}
                  onChange={(date) => {
                    if (date) {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, "0");
                      const day = String(date.getDate()).padStart(2, "0");
                      field.onChange(`${year}-${month}-${day}`);
                    } else {
                      field.onChange("");
                    }
                  }}
                  disabled={disabled}
                  placeholder="DD/MM/YYYY"
                  minDate={new Date(1900, 0, 1)}
                  maxDate={new Date()}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Grid>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="email@example.com"
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Địa chỉ</FormLabel>
            <FormControl>
              <Input
                placeholder="Số nhà, đường..."
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="preferred_staff_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chuyên viên ưu tiên (Nếu có)</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || undefined}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên yêu thích" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không có ưu tiên</SelectItem>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </SelectItem>
                ))}
                {technicians.length === 0 && (
                  <SelectItem value="_loading" disabled>
                    Đang tải danh sách...
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </Stack>
  );

  const renderHealth = () => (
    <Stack gap={6}>
      <FormField
        control={form.control}
        name="allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tiền sử dị ứng</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Liệt kê: Hải sản, Phấn hoa, Thuốc kháng sinh..."
                disabled={disabled}
                className="border-destructive/30 focus:border-destructive focus:ring-destructive/20 min-h-[100px] resize-none disabled:opacity-50"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="medical_notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ghi chú y tế &amp; Thai sản</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Bệnh nền, tình trạng sức khỏe, đang mang thai (tháng thứ mấy)..."
                disabled={disabled}
                className="min-h-[120px] resize-none"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </Stack>
  );

  // --- Main Render ---
  return (
    <Stack gap={4} className={className}>
      {mode === "update" && (
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => <input type="hidden" {...field} />}
        />
      )}

      {mode === "create" ? (
        <Stack gap={6} className="pt-2">
          <Stack gap={4}>
            <h3 className="text-base font-semibold">Hồ sơ cá nhân</h3>
            {renderProfile()}
          </Stack>

          <Stack gap={4}>
            <div className="border-t pt-4">
              <h3 className="text-base font-semibold">Thông tin sức khỏe</h3>
            </div>
            {renderHealth()}
          </Stack>
        </Stack>
      ) : (
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">Hồ sơ</TabsTrigger>
            <TabsTrigger value="health">Sức khỏe</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-4 border-none p-0">
            {renderProfile()}
          </TabsContent>

          <TabsContent value="health" className="mt-4 border-none p-0">
            {renderHealth()}
          </TabsContent>
        </Tabs>
      )}
    </Stack>
  );
}
