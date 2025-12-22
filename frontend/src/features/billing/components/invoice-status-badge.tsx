import { Badge, BadgePreset } from "@/shared/ui/badge";
import { InvoiceStatus } from "../model/types";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

const STATUS_TO_PRESET: Record<InvoiceStatus, BadgePreset> = {
  UNPAID: "invoice-unpaid",
  PAID: "invoice-paid",
  REFUNDED: "invoice-refunded",
  OVERDUE: "invoice-unpaid", // Reuse unpaid preset for OVERDUE
};

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  // For OVERDUE, use variant override
  if (status === "OVERDUE") {
    return <Badge variant="destructive">Quá hạn</Badge>;
  }
  return <Badge preset={STATUS_TO_PRESET[status]} />;
}
