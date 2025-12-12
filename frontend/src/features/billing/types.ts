export type InvoiceStatus = 'UNPAID' | 'PAID' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'CARD' | 'TRANSFER';

export interface Invoice {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  amount: number;
  paidAmount: number;
  status: InvoiceStatus;
  issuedAt: Date;
  dueDate?: Date;
  items: InvoiceItem[];
  payments?: Payment[];
  discountAmount?: number;
  discountReason?: string;
  finalAmount: number;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  serviceId?: string;
  serviceName: string;
  productId?: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  type: 'SERVICE' | 'PRODUCT';
}

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  transactionRef?: string;
  transactionTime: Date;
  note?: string;
  createdBy: string;
}

export interface InvoiceFilters {
  status?: InvoiceStatus[];
  fromDate?: Date;
  toDate?: Date;
  search?: string; // customer name, phone, invoice code
}

export interface CreateInvoicePayload {
  bookingId: string;
  customerId: string;
  items: {
    serviceId?: string;
    serviceName: string;
    unitPrice: number;
    quantity: number;
  }[];
  discountAmount?: number;
}

export interface CreatePaymentPayload {
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  transactionRef?: string;
  note?: string;
}

export interface InvoiceMetrics {
  totalRevenue: number;
  pendingAmount: number;
  paidInvoices: number;
  unpaidInvoices: number;
}
