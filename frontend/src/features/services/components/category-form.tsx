"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Box, HStack } from "@/shared/ui/layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Save } from "lucide-react";
import { createServiceCategory, updateServiceCategory } from "../actions";
import { ServiceCategory } from "../model/types";

const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc"),
  sort_order: z.coerce.number().int().default(0),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category?: ServiceCategory;
  onSuccess?: () => void;
  onCancel?: () => void;
  mode?: "create" | "edit";
}

export function CategoryForm({
  category,
  onSuccess,
  onCancel,
  mode = "create",
}: CategoryFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      sort_order: category?.sort_order || 0,
    },
  });

  const onSubmit = (values: CategoryFormValues) => {
    startTransition(async () => {
      let result;

      if (mode === "edit" && category) {
         result = await updateServiceCategory(category.id, values.name, values.sort_order);
      } else {
         result = await createServiceCategory(values.name, values.sort_order);
      }

      if (result.status === "success") {
        toast.success(
          mode === "create" ? "Đã tạo danh mục mới" : "Đã cập nhật danh mục"
        );
        form.reset();
        onSuccess?.();
      } else {
        toast.error("Lỗi", { description: result.message });
      }
    });
  };

  return (
    <Box className="bg-muted/40 p-4 border rounded-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên danh mục</FormLabel>
                <FormControl>
                  <Input
                    placeholder="VD: Cắt tóc, Gội đầu..."
                    className="bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sort_order"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Thứ tự hiển thị</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-background"
                    {...field}
                    value={(field.value ?? 0) as number}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <HStack justify="end" gap={2} className="pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Hủy
              </Button>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : mode === "create" ? (
                <Plus className="mr-2 size-4" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              {mode === "create" ? "Thêm mới" : "Lưu thay đổi"}
            </Button>
          </HStack>
        </form>
      </Form>
    </Box>
  );
}
