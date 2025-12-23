"use client";

import {
  Button,
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
  showToast,
} from "@/shared/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import { createPayment } from "../../actions";
import { PAYMENT_METHODS } from "../../constants";
import {
  CreatePaymentFormValues,
  createPaymentSchema,
} from "../../model/schemas";
import { Invoice } from "../../model/types";

interface PaymentFormProps {
  invoice: Invoice;
  onSuccess: () => void;
}

export function PaymentForm({ invoice, onSuccess }: PaymentFormProps) {
  const [isPending, startTransition] = useTransition();

  const remainingAmount = invoice.finalAmount - invoice.paidAmount;

  const form = useForm<CreatePaymentFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createPaymentSchema) as any,
    defaultValues: {
      amount: remainingAmount,
      method: "CASH",
      transactionRef: "",
      note: "",
    },
  });

  function onSubmit(values: CreatePaymentFormValues) {
    if (values.amount > remainingAmount) {
      form.setError("amount", {
        message: "Số tiền thanh toán không được lớn hơn số tiền còn lại",
      });
      return;
    }

    startTransition(async () => {
      const result = await createPayment({
        invoiceId: invoice.id,
        ...values,
      });

      if (result.status === "success") {
        showToast.success("Thanh toán thành công", result.message);
        onSuccess();
      } else {
        showToast.error(
          "Thanh toán thất bại",
          result.message || "Vui lòng thử lại"
        );
      }
    });
  }

  // Nếu đã thanh toán hết thì không hiện form
  if (invoice.status === "PAID" || remainingAmount <= 0) {
    return (
      <div className="bg-success/10 text-success border-success/20 rounded-md border p-4 text-center">
        Hóa đơn đã được thanh toán đầy đủ
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h4 className="text-sm font-semibold">Thanh toán mới</h4>

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền thanh toán</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phương thức</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phương thức" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {PAYMENT_METHODS.map((method) => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="transactionRef"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mã giao dịch (nếu có)</FormLabel>
              <FormControl>
                <Input placeholder="VD: FT23..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Input placeholder="Ghi chú thêm..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          Xác nhận thanh toán
        </Button>
      </form>
    </Form>
  );
}
