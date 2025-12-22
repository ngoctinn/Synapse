import {
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/shared/ui";
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 gap-0 flex flex-col bg-background border-l shadow-2xl">
        <SheetHeader className="px-6 py-4 border-b shrink-0 space-y-0">
          <SheetTitle className="text-lg font-semibold">Chi tiết hóa đơn {invoice.id}</SheetTitle>
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
