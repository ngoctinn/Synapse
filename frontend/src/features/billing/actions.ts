"use server";

import {
  MOCK_APPOINTMENTS,
  MOCK_CUSTOMERS,
  MOCK_SERVICES,
} from "@/features/appointments/model/mocks";
import { error, success } from "@/shared/lib/action-response";
import { executeAction } from "@/shared/lib/execute-action";
import { revalidatePath } from "next/cache";
import { MOCK_INVOICES } from "./model/mocks";
import type {
  CreatePaymentPayload,
  Invoice,
  InvoiceFilters,
  InvoiceMetrics,
} from "./model/types";

// === INVOICE ACTIONS ===

export async function createInvoice(bookingId: string) {
  return executeAction(
    "createInvoice",
    async () => {
      const existing = MOCK_INVOICES.find((i) => i.bookingId === bookingId);
      if (existing) throw new Error("DUPLICATE");

      const booking = MOCK_APPOINTMENTS.find((a) => a.id === bookingId);
      if (!booking) throw new Error("NOT_FOUND");
      if (booking.status !== "COMPLETED") throw new Error("INVALID_STATUS");

      const service = MOCK_SERVICES.find((s) => s.id === booking.serviceId);
      if (!service) throw new Error("SERVICE_NOT_FOUND");

      const item = {
        id: `ITEM-${Date.now()}`,
        invoiceId: "",
        serviceId: service.id,
        serviceName: service.name,
        quantity: 1,
        unitPrice: service.price,
        totalPrice: service.price,
        type: "SERVICE" as const,
      };

      const amount = item.totalPrice;
      let discountAmount = 0;
      let discountReason: string | undefined = undefined;

      const customer = MOCK_CUSTOMERS.find((c) => c.id === booking.customerId);
      if (customer) {
        if (customer.membershipLevel === "GOLD") {
          discountAmount = amount * 0.05;
          discountReason = "Gold Member (5%)";
        } else if (customer.membershipLevel === "PLATINUM") {
          discountAmount = amount * 0.1;
          discountReason = "Platinum Member (10%)";
        }
      }

      const finalAmount = amount - discountAmount;
      const newInvoice: Invoice = {
        id: `INV-${Date.now()}`,
        bookingId: booking.id,
        customerId: booking.customerId,
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        amount,
        paidAmount: 0,
        status: "UNPAID",
        issuedAt: new Date(),
        items: [item],
        payments: [],
        discountAmount,
        discountReason,
        finalAmount,
      };

      newInvoice.items[0].invoiceId = newInvoice.id;
      MOCK_INVOICES.unshift(newInvoice);
      revalidatePath("/admin/billing");

      return newInvoice;
    },
    "Lỗi khi tạo hóa đơn"
  );
}

export async function getInvoices(filters?: InvoiceFilters) {
  return executeAction(
    "getInvoices",
    async () => {
      let invoices = [...MOCK_INVOICES];
      if (filters) {
        if (filters.status && filters.status.length > 0) {
          invoices = invoices.filter((inv) =>
            filters.status!.includes(inv.status)
          );
        }
        if (filters.search) {
          const query = filters.search.toLowerCase();
          invoices = invoices.filter(
            (inv) =>
              inv.customerName.toLowerCase().includes(query) ||
              inv.id.toLowerCase().includes(query) ||
              (inv.customerPhone && inv.customerPhone.includes(query))
          );
        }
      }
      invoices.sort((a, b) => b.issuedAt.getTime() - a.issuedAt.getTime());
      return invoices;
    },
    "Không thể tải danh sách hóa đơn"
  );
}

export async function getInvoice(id: string) {
  return executeAction(
    "getInvoice",
    async () => {
      const invoice = MOCK_INVOICES.find((inv) => inv.id === id);
      if (!invoice) throw new Error("NOT_FOUND");
      return invoice;
    },
    "Không tìm thấy hóa đơn"
  );
}

export async function createPayment(payload: CreatePaymentPayload) {
  return executeAction(
    "createPayment",
    async () => {
      const invoiceIndex = MOCK_INVOICES.findIndex(
        (inv) => inv.id === payload.invoiceId
      );
      if (invoiceIndex === -1) throw new Error("NOT_FOUND");

      const invoice = MOCK_INVOICES[invoiceIndex];
      if (payload.amount > invoice.finalAmount - invoice.paidAmount) {
        throw new Error("AMOUNT_EXCEEDED");
      }

      const newPayment = {
        id: `PAY-${Date.now()}`,
        invoiceId: invoice.id,
        amount: payload.amount,
        method: payload.method,
        transactionRef: payload.transactionRef,
        transactionTime: new Date(),
        note: payload.note,
        createdBy: "current-user",
      };

      const updatedInvoice = {
        ...invoice,
        paidAmount: invoice.paidAmount + payload.amount,
        payments: [...(invoice.payments || []), newPayment],
      };

      if (updatedInvoice.paidAmount >= updatedInvoice.finalAmount) {
        updatedInvoice.status = "PAID";
      }

      MOCK_INVOICES[invoiceIndex] = updatedInvoice;
      revalidatePath("/admin/billing");
      return updatedInvoice;
    },
    "Lỗi khi xử lý thanh toán"
  );
}

export async function getBillingMetrics() {
  return executeAction(
    "getBillingMetrics",
    async () => {
      const totalRevenue = MOCK_INVOICES.reduce(
        (sum, inv) => sum + inv.paidAmount,
        0
      );
      const pendingAmount = MOCK_INVOICES.reduce(
        (sum, inv) => sum + (inv.finalAmount - inv.paidAmount),
        0
      );
      const paidInvoices = MOCK_INVOICES.filter(
        (inv) => inv.status === "PAID"
      ).length;
      const unpaidInvoices = MOCK_INVOICES.filter(
        (inv) => inv.status === "UNPAID"
      ).length;
      return {
        totalRevenue,
        pendingAmount,
        paidInvoices,
        unpaidInvoices,
      } as InvoiceMetrics;
    },
    "Không thể tải thống kê"
  );
}
