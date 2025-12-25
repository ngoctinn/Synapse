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
import { formatCurrency } from "@/shared/lib/utils";
import { useFormContext } from "react-hook-form";
import { ServiceFormValues } from "../../model/schemas";
import { ServiceCategory } from "../../model/types";

interface BasicTabProps {
  categories: ServiceCategory[];
}

export function BasicTab({ categories }: BasicTabProps) {
  const form = useFormContext<ServiceFormValues>();

  return (
    <div className="space-y-6 py-4">
      {/* Name & Category */}
      <div className="grid grid-cols-2 gap-4">
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
      </div>

      {/* Price & Duration */}
      <div className="grid grid-cols-2 gap-4">
         <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Giá dịch vụ (VNĐ)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className="pr-12 font-mono"
                  />
                  <span className="text-muted-foreground absolute right-3 top-2.5 text-sm">
                    đ
                  </span>
                </div>
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
      </div>

      {/* Buffer Time */}
      <FormField
          control={form.control}
          name="buffer_time"
          render={({ field }) => (
            <FormItem>
              <div className="mb-2 flex items-center justify-between">
                 <FormLabel>Thời gian nghỉ (Buffer Time)</FormLabel>
                 <span className="text-muted-foreground font-mono text-sm">{field.value} phút</span>
              </div>
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
    </div>
  );
}
