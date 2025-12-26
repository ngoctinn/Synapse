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
  Slider,
  Textarea,
} from "@/shared/ui";
import { useFormContext } from "react-hook-form";
import { ServiceFormValues } from "../../model/schemas";
import { ServiceCategory } from "../../model/types";
import { NumberInput } from "@/shared/ui/custom/number-input";
import { Stack, Group, Grid } from "@/shared/ui/layout";

interface BasicTabProps {
  categories: ServiceCategory[];
}

export function BasicTab({ categories }: BasicTabProps) {
  const form = useFormContext<ServiceFormValues>();

  return (
    <Stack gap={6} className="py-4">
      {/* Name & Category */}
      <Grid gap={4} className="grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên dịch vụ <span className="text-destructive">*</span></FormLabel>
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
              <FormLabel>Danh mục</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            </FormItem>
          )}
        />
      </Grid>

      {/* Price & Duration */}
      <Grid gap={4} className="grid-cols-2">
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
                  suffix="đ"
                  className="pr-8" // spacing for suffix
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
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                     <SelectValue placeholder="Chọn thời lượng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[15, 30, 45, 60, 75, 90, 120, 150, 180].map((min) => (
                    <SelectItem key={min} value={min.toString()}>
                      {min} phút
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Group align="center" justify="between" className="mb-2">
                 <FormLabel>Thời gian nghỉ (Buffer Time)</FormLabel>
                 <span className="text-muted-foreground font-mono text-sm">{field.value} phút</span>
              </Group>
              <FormControl>
                <Slider
                   min={0}
                   max={60}
                   step={5}
                   value={[field.value || 0]}
                   onValueChange={(vals) => field.onChange(vals[0])}
                />
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
    </Stack>
  );
}
