"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";

import { createPayment } from "../../actions";
import { PAYMENT_METHODS } from "../../constants";
import { CreatePaymentFormValues, createPaymentSchema } from "../../schemas";
import { Invoice } from "../../types";

interface PaymentFormProps {
  invoice: Invoice;
  onSuccess: () => void;
}

export function PaymentForm({ invoice, onSuccess }: PaymentFormProps) {
  const [isPending, startTransition] = useTransition();

  const remainingAmount = invoice.finalAmount - invoice.paidAmount;

  const form = useForm<CreatePaymentFormValues>({
    resolver: zodResolver(createPaymentSchema),
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
        toast.success(result.message);
        onSuccess();
      } else {
        toast.error(result.message || "Thanh toán thất bại");
      }
    });
  }

  // Nếu đã thanh toán hết thì không hiện form
  if (invoice.status === "PAID" || remainingAmount <= 0) {
    return (
      <div className="p-4 bg-green-50 text-green-700 rounded-md border border-green-200 text-center">
        Hóa đơn đã được thanh toán đầy đủ
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <h4 className="font-semibold text-sm">Thanh toán mới</h4>
        
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
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Xác nhận thanh toán
        </Button>
      </form>
    </Form>
  );
}
