"use client";

import { Form } from "@/shared/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useBookingStore } from "../../hooks/use-booking-store";
import { customerInfoSchema, CustomerInfoSchema } from "../../schemas";
import { BookingSummary } from "./booking-summary";
import { CustomerForm } from "./customer-form";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Info, CreditCard } from "lucide-react";
import { createClient } from "@/shared/lib/supabase/client";

export const CustomerInfoStep = () => {
  const { customerInfo, setCustomerInfo } = useBookingStore();
  const [isPreFilling, setIsPreFilling] = useState(false);

  const form = useForm<CustomerInfoSchema>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: customerInfo || {
      full_name: "",
      phone_number: "",
      email: "",
      notes: "",
    },
    mode: "onBlur",
  });

  // Pre-fill logic for logged-in users
  useEffect(() => {
    const prefillUser = async () => {
      // Only pre-fill if form is empty and no store data
      if (customerInfo) return;

      setIsPreFilling(true);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        form.reset({
          full_name: user.user_metadata?.full_name || "",
          email: user.email || "",
          phone_number: user.user_metadata?.phone_number || "",
          notes: "",
        });
        // Sync to store immediately
        setCustomerInfo({
          full_name: user.user_metadata?.full_name || "",
          email: user.email || "",
          phone_number: user.user_metadata?.phone_number || "",
        });
      }
      setIsPreFilling(false);
    };

    prefillUser();
  }, [form, customerInfo, setCustomerInfo]);

  const syncToStore = () => {
    const values = form.getValues();
    setCustomerInfo({
      full_name: values.full_name || "",
      phone_number: values.phone_number || "",
      email: values.email || undefined,
      notes: values.notes || undefined,
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
      <div className="space-y-8 lg:col-span-3">
        {/* Payment Notice */}
        <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900/30 dark:bg-blue-950/20">
          <CreditCard className="size-5 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-blue-800 dark:text-blue-300">
            Thanh toán tại quầy
          </AlertTitle>
          <AlertDescription className="text-blue-700/80 dark:text-blue-400/70">
            Synapse hiện hỗ trợ thanh toán trực tiếp tại Spa sau khi quý khách
            sử dụng dịch vụ. Chúng tôi chấp nhận Tiền mặt, Chuyển khoản và các
            loại Thẻ Visa/Mastercard.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form className="space-y-8" onBlur={syncToStore}>
            <div
              className={isPreFilling ? "pointer-events-none opacity-50" : ""}
            >
              <CustomerForm form={form} />
            </div>
          </form>
        </Form>
      </div>

      <div className="lg:col-span-2">
        <BookingSummary />
      </div>
    </div>
  );
};
