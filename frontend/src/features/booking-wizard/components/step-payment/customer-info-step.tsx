"use client";

import { Form } from "@/shared/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useBookingStore } from "../../hooks/use-booking-store";
import { customerInfoSchema, CustomerInfoSchema } from "../../schemas";
import { BookingSummary } from "./booking-summary";
import { CustomerForm } from "./customer-form";

export const CustomerInfoStep = () => {
  const { customerInfo, setCustomerInfo } = useBookingStore();

  const form = useForm<CustomerInfoSchema>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: customerInfo || {
      full_name: "",
      phone_number: "",
      email: "",
      notes: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  // Function to sync form values to store
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
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-3 space-y-8">
        <Form {...form}>
          <form className="space-y-8" onBlur={syncToStore}>
            <CustomerForm form={form} />
          </form>
        </Form>
      </div>

      <div className="lg:col-span-2">
        <BookingSummary />
      </div>
    </div>
  );
};
