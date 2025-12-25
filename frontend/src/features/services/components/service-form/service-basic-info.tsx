"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Settings2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RequiredMark,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
  Button,
} from "@/shared/ui";
import { ColorSwatchGroup } from "@/shared/ui/custom/color-swatch-group";
import { SERVICE_COLORS } from "../../constants";
import { ServiceCategory } from "../../model/types";
import { CategoryManagerDialog } from "../category-manager/category-manager-dialog";
import { ImageUpload } from "../image-upload";

interface ServiceBasicInfoProps {
  categories: ServiceCategory[];
  onCategoriesChange: (cats: ServiceCategory[]) => void;
}

export function ServiceBasicInfo({
  categories,
  onCategoriesChange,
}: ServiceBasicInfoProps) {
  const form = useFormContext();
  const [isCategoryManagerOpen, setCategoryManagerOpen] = useState(false);

  return (
    <div className="space-y-6">
      <CategoryManagerDialog
        open={isCategoryManagerOpen}
        onOpenChange={setCategoryManagerOpen}
        onCategoriesChange={onCategoriesChange}
      />

      {/* Active Toggle */}
      <div className="flex items-center justify-between pb-2">
        <div>
          <span className="text-sm font-medium">Trạng thái hoạt động</span>
          <p className="text-muted-foreground text-[11px]">
            Hiển thị dịch vụ này trên ứng dụng đặt lịch của khách hàng
          </p>
        </div>
        <FormField
          control={form.control}
          name="is_active"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/* Category Selection */}
      <FormField
        control={form.control}
        name="category_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Danh mục</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Select value={field.value || ""} onValueChange={field.onChange}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="-- Chọn danh mục --" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setCategoryManagerOpen(true)}
                title="Quản lý danh mục"
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="flex flex-col gap-6">
        <div className="flex justify-center">
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Ảnh đại diện</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    className="aspect-video h-52 w-full rounded-lg object-cover"
                  />
                </FormControl>
                <p className="text-muted-foreground mt-1.5 text-[11px]">
                  Khuyến nghị: Tỷ lệ 16:9, tối đa 2MB (JPG, PNG)
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Tên dịch vụ <RequiredMark />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="VD: Massage Body"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Màu hiển thị</FormLabel>
                <FormControl>
                  <ColorSwatchGroup
                    value={field.value}
                    onChange={field.onChange}
                    options={SERVICE_COLORS}
                    ariaLabel="Chọn màu hiển thị cho dịch vụ"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mô tả</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Mô tả chi tiết..."
                className="min-h-[100px] resize-none text-sm"
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
