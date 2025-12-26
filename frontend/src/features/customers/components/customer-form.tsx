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
  Calendar,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/ui";
import { format, parse } from "date-fns";
import { vi } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useFormContext } from "react-hook-form";

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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal pl-3",
                        !field.value && "text-muted-foreground"
                      )}
                      disabled={disabled}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                      {field.value && !isNaN(Date.parse(field.value)) ? (
                        format(parse(field.value, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")
                      ) : (
                        <span>DD/MM/YYYY</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        field.value && !isNaN(Date.parse(field.value))
                          ? parse(field.value, "yyyy-MM-dd", new Date())
                          : undefined
                      }
                      onSelect={(date) => {
                        if (date) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, "0");
                          const day = String(date.getDate()).padStart(2, "0");
                          field.onChange(`${year}-${month}-${day}`);
                        } else {
                          field.onChange("");
                        }
                      }}
                      initialFocus
                      locale={vi}
                      captionLayout="dropdown"
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                    />
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
    </div>
  );

  const renderHealth = () => (
    <div className="space-y-6">
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
    </div>
  );

  // --- Main Render ---
  return (
    <div className={cn("space-y-4", className)}>
      {mode === "update" && (
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => <input type="hidden" {...field} />}
        />
      )}

      {mode === "create" ? (
        <div className="space-y-6 pt-2">
          <div className="space-y-4">
            <h3 className="text-base font-semibold">Hồ sơ cá nhân</h3>
            {renderProfile()}
          </div>

          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="text-base font-semibold">Thông tin sức khỏe</h3>
            </div>
            {renderHealth()}
          </div>
        </div>
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
    </div>
  );
}
