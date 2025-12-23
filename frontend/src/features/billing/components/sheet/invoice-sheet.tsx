import {
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
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
      <SheetContent className="bg-background flex w-full flex-col gap-0 border-l p-0 shadow-2xl sm:max-w-lg">
        <SheetHeader className="shrink-0 space-y-0 border-b px-6 py-4">
          <SheetTitle className="text-lg font-semibold">
            Chi tiết hóa đơn {invoice.id}
          </SheetTitle>
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
