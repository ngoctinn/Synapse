"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useTransition } from "react";
import {
  DefaultValues,
  FieldValues,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

/**
 * Kết quả trả về từ action
 */
interface ActionResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Options cho useSheetForm hook
 */
interface UseSheetFormOptions<
  TFormValues extends FieldValues,
  TData = unknown
> {
  /** Zod schema để validate form */
  schema: z.ZodType<TFormValues>;

  /** Giá trị mặc định cho form */
  defaultValues: DefaultValues<TFormValues>;

  /** Sheet có đang mở không - dùng để reset form */
  open: boolean;

  /** Entity data hiện tại (cho update mode) */
  data?: TData;

  /** Hàm transform entity data thành form values */
  transformData?: (data: TData) => Partial<TFormValues>;

  /** Server action hoặc async function để submit */
  action: (formData: TFormValues) => Promise<ActionResult>;

  /** Callback khi submit thành công */
  onSuccess?: (result: ActionResult) => void;

  /** Callback khi submit thất bại */
  onError?: (error: string) => void;

  /** Toast messages */
  toastMessages?: {
    success?: string;
    error?: string;
  };
}

/**
 * Return type của useSheetForm
 */
interface UseSheetFormReturn<TFormValues extends FieldValues> {
  /** Form instance từ react-hook-form */
  form: UseFormReturn<TFormValues>;

  /** Có đang submit không */
  isPending: boolean;

  /** Handler để submit form */
  handleSubmit: (data: TFormValues) => void;

  /** Handler để wrap trong form onSubmit */
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
}

/**
 * Custom hook để xử lý form trong Sheet/Dialog.
 * Encapsulates: useForm, useTransition, reset on open, success/error handling.
 *
 * @example
 * ```tsx
 * const { form, isPending, onSubmit } = useSheetForm({
 *   schema: serviceSchema,
 *   defaultValues: { name: "", price: 0 },
 *   open,
 *   data: initialService,
 *   transformData: (service) => ({
 *     name: service.name,
 *     price: service.price,
 *   }),
 *   action: async (data) => createService(data),
 *   onSuccess: () => onOpenChange(false),
 *   toastMessages: {
 *     success: "Tạo dịch vụ thành công",
 *     error: "Không thể tạo dịch vụ",
 *   },
 * })
 *
 * return (
 *   <Form {...form}>
 *     <form onSubmit={onSubmit}>...</form>
 *   </Form>
 * )
 * ```
 */
export function useSheetForm<TFormValues extends FieldValues, TData = unknown>(
  options: UseSheetFormOptions<TFormValues, TData>
): UseSheetFormReturn<TFormValues> {
  const {
    schema,
    defaultValues,
    open,
    data,
    transformData,
    action,
    onSuccess,
    onError,
    toastMessages,
  } = options;

  const [isPending, startTransition] = useTransition();

  // Khởi tạo form - sử dụng type assertion để bypass complex generic issues
  const form = useForm<TFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any) as any,
    defaultValues,
  });

  // Reset form khi sheet mở
  useEffect(() => {
    if (open) {
      if (data && transformData) {
        // Update mode - transform data thành form values
        const transformedValues = transformData(data);
        form.reset({ ...defaultValues, ...transformedValues } as TFormValues);
      } else {
        // Create mode - reset về default
        form.reset(defaultValues as TFormValues);
      }
    }
  }, [open, data, transformData, form, defaultValues]);

  // Handler submit form
  const handleSubmit = useCallback(
    (formData: TFormValues) => {
      startTransition(async () => {
        try {
          const result = await action(formData);

          if (result.success) {
            const successMessage =
              toastMessages?.success || result.message || "Thao tác thành công";
            toast.success(successMessage);
            onSuccess?.(result);
          } else {
            const errorMessage =
              result.error ||
              result.message ||
              toastMessages?.error ||
              "Đã có lỗi xảy ra";
            toast.error(errorMessage);
            onError?.(errorMessage);
          }
        } catch (error) {
          const errorMessage =
            toastMessages?.error || "Đã có lỗi xảy ra, vui lòng thử lại";
          toast.error(errorMessage);
          onError?.(errorMessage);
          console.error("Form submit error:", error);
        }
      });
    },
    [action, onSuccess, onError, toastMessages]
  );

  // Wrap handleSubmit để dùng với form onSubmit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = form.handleSubmit(handleSubmit as any);

  return {
    form,
    isPending,
    handleSubmit,
    onSubmit,
  } as UseSheetFormReturn<TFormValues>;
}
