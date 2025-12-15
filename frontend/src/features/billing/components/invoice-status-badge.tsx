import { Badge, BadgePreset } from "@/shared/ui/badge";
import { InvoiceStatus } from "../types";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

const STATUS_TO_PRESET: Record<InvoiceStatus, BadgePreset> = {
  UNPAID: "invoice-unpaid",
  PAID: "invoice-paid",
  REFUNDED: "invoice-refunded",
};

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  return <Badge preset={STATUS_TO_PRESET[status]} />;
}
