"use client";

import { useBookingStore } from "../../hooks/use-booking-store";
import { CustomerForm } from "./customer-form";
import { PaymentMethods } from "./payment-methods";
import { BookingSummary } from "./booking-summary";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerInfoSchema, CustomerInfoSchema } from "../../schemas";
import { useEffect } from "react";
import { Form } from "@/shared/ui/form";
import { useDebounce } from "use-debounce";

export const PaymentStep = () => {
  const { customerInfo, paymentMethod, setCustomerInfo, setPaymentMethod } = useBookingStore();

  const form = useForm<CustomerInfoSchema>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: customerInfo || {
      full_name: "",
      phone_number: "",
      email: "",
      notes: "",
    },
    mode: "onChange",
  });

  const [debouncedValues] = useDebounce(form.watch(), 500);

  // Sync form values to store
  useEffect(() => {
    // Only update if valid to avoid clearing store with invalid initial data unnecessarily, 
    // but for UX, we might want to persist even partial data. 
    // Let's persist everything so user doesn't lose data when switching steps.
    const { full_name, phone_number, email, notes } = debouncedValues;
    setCustomerInfo({
      full_name: full_name || "",
      phone_number: phone_number || "",
      email: email || undefined,
      notes: notes || undefined,
    });
  }, [debouncedValues, setCustomerInfo]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-8">
        <Form {...form}>
          <form className="space-y-8">
            <CustomerForm form={form} />
            <PaymentMethods 
              value={paymentMethod || "COD"} 
              onChange={setPaymentMethod} 
            />
          </form>
        </Form>
      </div>
      
      <div className="lg:col-span-2">
        <BookingSummary />
      </div>
    </div>
  );
};
