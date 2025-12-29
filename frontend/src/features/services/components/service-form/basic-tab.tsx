import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  Button,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from "@/shared/ui";
import { Plus } from "lucide-react";
import { CreateCategoryDialog } from "../create-category-dialog";
import { Card, CardContent } from "@/shared/ui/card";
import { RequiredMark } from "@/shared/components";
import { NumberInput } from "@/shared/components/number-input";
import { Grid, HStack, Stack } from "@/shared/ui/layout";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ServiceFormValues } from "../../model/schemas";
import { ServiceCategory } from "../../model/types";

interface BasicTabProps {
  categories: ServiceCategory[];
}

export function BasicTab({ categories }: BasicTabProps) {
  const form = useFormContext<ServiceFormValues>();
  const router = useRouter();

  return (
    <Stack gap={6}>
      {/* Name & Category */}
      <Grid gap={4} cols={2}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Tên dịch vụ <RequiredMark />
              </FormLabel>
              <FormControl>
                <Input placeholder="Ví dụ: Cắt tóc nam basic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Danh mục <RequiredMark />
              </FormLabel>
              <HStack gap={2} align="start">
                <div className="flex-1">
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
                <CreateCategoryDialog
                  onSuccess={() => {
                    router.refresh();
                  }}
                  trigger={
                    <Button
                      size="icon"
                      variant="outline"
                      type="button"
                      title="Tạo danh mục mới"
                    >
                      <Plus className="size-4" />
                    </Button>
                  }
                />
              </HStack>
            </FormItem>
          )}
        />
      </Grid>

      {/* Price & Duration */}
      <Grid gap={4} cols={2}>
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá dịch vụ (VNĐ)</FormLabel>
              <FormControl>
                <NumberInput
                  placeholder="0"
                  value={field.value}
                  onChange={field.onChange}
                  suffix="VND"
                  step={1000}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thời lượng (Phút)</FormLabel>
              <FormControl>
                <Stack gap={3}>
                  <NumberInput
                    min={5}
                    max={480}
                    step={5}
                    value={field.value}
                    onChange={field.onChange}
                    suffix="phút"
                    className="w-full"
                  />
                  <div className="flex flex-wrap gap-2">
                    {[15, 30, 45, 60, 90, 120].map((preset) => (
                      <Button
                        key={preset}
                        type="button"
                        variant={field.value === preset ? "default" : "outline"}
                        size="sm"
                        className="h-7 px-3 text-xs"
                        onClick={() => field.onChange(preset)}
                      >
                        {preset}p
                      </Button>
                    ))}
                  </div>
                </Stack>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Grid>

      {/* Buffer Time */}
      <FormField
        control={form.control}
        name="buffer_time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Thời gian nghỉ (Buffer Time)</FormLabel>
            <FormControl>
              <Stack gap={3}>
                <NumberInput
                  min={0}
                  max={120}
                  step={5}
                  value={field.value}
                  onChange={field.onChange}
                  suffix="phút"
                  className="w-full"
                />
                <div className="flex flex-wrap gap-2">
                  {[0, 5, 10, 15, 30, 45].map((preset) => (
                    <Button
                      key={preset}
                      type="button"
                      variant={field.value === preset ? "default" : "outline"}
                      size="sm"
                      className="h-7 px-3 text-xs"
                      onClick={() => field.onChange(preset)}
                    >
                      {preset === 0 ? "Không nghỉ" : `${preset}p`}
                    </Button>
                  ))}
                </div>
              </Stack>
            </FormControl>
            <p className="text-muted-foreground text-xs">
              Khoảng nghỉ bắt buộc sau mỗi dịch vụ để dọn dẹp và chuẩn bị.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả ngắn</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Mô tả chi tiết về dịch vụ..."
                className="resize-none"
                rows={3}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Active Status */}
      <FormField
        control={form.control}
        name="is_active"
        render={({ field }) => (
          <FormItem>
            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    Trạng thái hoạt động
                  </FormLabel>
                  <p className="text-muted-foreground text-sm">
                    Dịch vụ sẽ hiển thị trên trang đặt lịch của khách hàng khi
                    bật.
                  </p>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </CardContent>
            </Card>
          </FormItem>
        )}
      />
    </Stack>
  );
}
