import { create } from "zustand";
import { getBillingMetrics, getInvoices } from "../actions";
import { Invoice, InvoiceFilters, InvoiceMetrics } from "../model/types";

interface BillingState {
  invoices: Invoice[];
  metrics: InvoiceMetrics | null;
  isLoading: boolean;
  error: string | null;
}

interface BillingActions {
  fetchInvoices: (filters?: InvoiceFilters) => Promise<void>;
  fetchMetrics: () => Promise<void>;
  loadAllData: () => Promise<void>;
  clearError: () => void;
}

export const useBillingStore = create<BillingState & BillingActions>(
  (set, _get) => ({
    invoices: [],
    metrics: null,
    isLoading: false,
    error: null,

    fetchInvoices: async (filters) => {
      set({ isLoading: true, error: null });
      const res = await getInvoices(filters);
      if (res.status === "success") {
        set({ invoices: res.data || [], isLoading: false });
      } else {
        set({ error: res.message, isLoading: false });
      }
    },

    fetchMetrics: async () => {
      const res = await getBillingMetrics();
      if (res.status === "success") {
        set({ metrics: res.data || null });
      }
    },

    loadAllData: async () => {
      set({ isLoading: true, error: null });
      try {
        const [invRes, metricRes] = await Promise.all([
          getInvoices(),
          getBillingMetrics(),
        ]);

        if (invRes.status === "success") {
          set({ invoices: invRes.data || [] });
        }
        if (metricRes.status === "success") {
          set({ metrics: metricRes.data || null });
        }
      } catch (_err) {
        set({ error: "Lỗi khi tải dữ liệu billing" });
      } finally {
        set({ isLoading: false });
      }
    },

    clearError: () => set({ error: null }),
  })
);
