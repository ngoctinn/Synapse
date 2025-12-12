import { BillingPage } from "@/features/billing/components/billing-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lý Hóa đơn | Synapse",
  description: "Quản lý hóa đơn và thanh toán",
};

export default function Page() {
  return <BillingPage />;
}
