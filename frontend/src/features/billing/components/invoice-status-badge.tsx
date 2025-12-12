import { Badge } from "@/shared/ui/badge";
import { INVOICE_STATUS_COLORS, INVOICE_STATUS_LABELS } from "../constants";
import { InvoiceStatus } from "../types";

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
}

export function InvoiceStatusBadge({ status }: InvoiceStatusBadgeProps) {
  return (
    <Badge variant={INVOICE_STATUS_COLORS[status]}>
      {INVOICE_STATUS_LABELS[status]}
    </Badge>
  );
}
