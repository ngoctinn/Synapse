import {
    Separator,
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/shared/ui";
import { Invoice } from "../../types";
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader>
          <SheetTitle>Chi tiết hóa đơn {invoice.id}</SheetTitle>
          <SheetDescription>
            Xem chi tiết hóa đơn và thực hiện thanh toán.
          </SheetDescription>
        </SheetHeader>

        <div className="sheet-scroll-area">
          <div className="space-y-6">
            <InvoiceDetails invoice={invoice} />
            <Separator />
            <PaymentForm invoice={invoice} onSuccess={onUpdate} />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
