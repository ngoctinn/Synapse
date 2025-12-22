import { InvoiceStatus, PaymentMethod } from "./model/types";

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  UNPAID: "Chưa thanh toán",
  PAID: "Đã thanh toán",
  REFUNDED: "Đã hoàn tiền",
  OVERDUE: "Quá hạn",
};

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, "default" | "secondary" | "destructive" | "outline" | "success" | "warning"> = {
  UNPAID: "warning",
  PAID: "success",
  REFUNDED: "destructive",
  OVERDUE: "destructive",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CASH: "Tiền mặt",
  CARD: "Thẻ",
  TRANSFER: "Chuyển khoản",
};

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: "CASH", label: "Tiền mặt" },
  { value: "CARD", label: "Thẻ tín dụng/ghi nợ" },
  { value: "TRANSFER", label: "Chuyển khoản ngân hàng" },
];
