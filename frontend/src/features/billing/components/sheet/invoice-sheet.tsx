import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Invoice } from "../../types";
import { InvoiceDetails } from "./invoice-details";
import { PaymentForm } from "./payment-form";
import { Separator } from "@/shared/ui/separator";

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
      <SheetContent className="w-[400px] sm:w-[540px] flex flex-col p-0">
        <div className="p-6 pb-2">
            <SheetHeader>
            <SheetTitle>Chi tiết hóa đơn {invoice.id}</SheetTitle>
            <SheetDescription>
                Xem chi tiết hóa đơn và thực hiện thanh toán.
            </SheetDescription>
            </SheetHeader>
        </div>
        
        <ScrollArea className="flex-1 px-6">
            <div className="space-y-6 pb-6">
                <InvoiceDetails invoice={invoice} />
                <Separator />
                <PaymentForm invoice={invoice} onSuccess={onUpdate} />
            </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
