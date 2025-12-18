"use server";

import { MOCK_APPOINTMENTS, MOCK_CUSTOMERS, MOCK_SERVICES } from "@/features/appointments/mock-data";
import { ActionResponse, error, success } from "@/shared/lib/action-response";
import { revalidatePath } from "next/cache";
import { MOCK_INVOICES } from "./mock-data";
import { CreatePaymentPayload, Invoice, InvoiceFilters, InvoiceMetrics } from "./types";

export async function createInvoice(bookingId: string): Promise<ActionResponse<Invoice>> {
  try {
    const existing = MOCK_INVOICES.find(i => i.bookingId === bookingId);
    if (existing) return error("Hóa đơn cho lịch hẹn này đã tồn tại");

    const booking = MOCK_APPOINTMENTS.find(a => a.id === bookingId);
    if (!booking) return error("Không tìm thấy lịch hẹn");
    if (booking.status !== "COMPLETED") return error("Chỉ có thể tạo hóa đơn cho lịch hẹn đã hoàn thành");

    const service = MOCK_SERVICES.find(s => s.id === booking.serviceId);
    if (!service) return error("Không tìm thấy dịch vụ");

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
    let discountReason = undefined;

    const customer = MOCK_CUSTOMERS.find(c => c.id === booking.customerId);
    if (customer) {
      if (customer.membershipLevel === 'GOLD') {
        discountAmount = amount * 0.05;
        discountReason = "Gold Member (5%)";
      } else if (customer.membershipLevel === 'PLATINUM') {
        discountAmount = amount * 0.10;
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
      amount: amount,
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

    return success(newInvoice, "Tạo hóa đơn thành công");
  } catch {
    return error("Lỗi khi tạo hóa đơn");
  }
}

export async function getInvoices(filters?: InvoiceFilters): Promise<ActionResponse<Invoice[]>> {
  try {
    let invoices = [...MOCK_INVOICES];
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        invoices = invoices.filter((inv) => filters.status!.includes(inv.status));
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
    return success(invoices);
  } catch {
    return error("Không thể tải danh sách hóa đơn");
  }
}

export async function getInvoice(id: string): Promise<ActionResponse<Invoice>> {
  try {
    const invoice = MOCK_INVOICES.find((inv) => inv.id === id);
    return invoice ? success(invoice) : error("Không tìm thấy hóa đơn");
  } catch {
    return error("Lỗi khi tải chi tiết hóa đơn");
  }
}

export async function createPayment(payload: CreatePaymentPayload): Promise<ActionResponse<Invoice>> {
  try {
    const invoiceIndex = MOCK_INVOICES.findIndex((inv) => inv.id === payload.invoiceId);
    if (invoiceIndex === -1) return error("Không tìm thấy hóa đơn");

    const invoice = MOCK_INVOICES[invoiceIndex];
    if (payload.amount > (invoice.finalAmount - invoice.paidAmount)) return error("Số tiền thanh toán vượt quá số tiền còn lại");

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
      // const pointsEarned = Math.floor(updatedInvoice.finalAmount / 10000);
      // TODO: Dispatch loyalty points event here
    }

    MOCK_INVOICES[invoiceIndex] = updatedInvoice;
    revalidatePath("/admin/billing");
    return success(updatedInvoice, "Thanh toán thành công");
  } catch {
    return error("Lỗi khi xử lý thanh toán");
  }
}

export async function getBillingMetrics(): Promise<ActionResponse<InvoiceMetrics>> {
  try {
    const totalRevenue = MOCK_INVOICES.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const pendingAmount = MOCK_INVOICES.reduce((sum, inv) => sum + (inv.finalAmount - inv.paidAmount), 0);
    const paidInvoices = MOCK_INVOICES.filter((inv) => inv.status === "PAID").length;
    const unpaidInvoices = MOCK_INVOICES.filter((inv) => inv.status === "UNPAID").length;

    return success({ totalRevenue, pendingAmount, paidInvoices, unpaidInvoices });
  } catch {
    return error("Không thể tải thống kê");
  }
}
