import { Separator } from "@/shared/ui";
import { ActionSheet } from "@/shared/ui/custom";
import { Invoice } from "../../model/types";
import { InvoiceDetails } from "./invoice-details";
import { PaymentForm } from "./payment-form";

interface InvoiceSheetProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export function InvoiceSheet({
  invoice,
  open,
  onOpenChange,
  onUpdate,
}: InvoiceSheetProps) {
  if (!invoice) return null;

  return (
    <ActionSheet
      open={open}
      onOpenChange={onOpenChange}
      title={`Chi tiết hóa đơn ${invoice.id}`}
      description="Xem chi tiết và thanh toán hóa đơn"
    >
      <div className="space-y-6">
        <InvoiceDetails invoice={invoice} />
        <Separator />
        <PaymentForm invoice={invoice} onSuccess={onUpdate} />
      </div>
    </ActionSheet>
  );
}
