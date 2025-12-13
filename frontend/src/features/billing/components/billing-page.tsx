"use client";

import { PageContent, PageHeader, PageShell, SurfaceCard } from "@/shared/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { AlertCircle, CheckCircle, DollarSign, FileText } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getBillingMetrics, getInvoices } from "../actions";
import { Invoice, InvoiceMetrics } from "../types";
import { InvoiceTable } from "./invoice-table";
import { InvoiceSheet } from "./sheet/invoice-sheet";

export function BillingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [metrics, setMetrics] = useState<InvoiceMetrics | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const loadData = () => {
    startTransition(async () => {
      const [invRes, metricRes] = await Promise.all([
        getInvoices(),
        getBillingMetrics(),
      ]);

      if (invRes.status === "success" && invRes.data) {
        setInvoices(invRes.data);
      }
      if (metricRes.status === "success" && metricRes.data) {
        setMetrics(metricRes.data);
      }
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsSheetOpen(true);
  };

  const handleUpdate = () => {
    loadData();
    // Update selected invoice to reflect changes
    if (selectedInvoice) {
        // We need to re-fetch the specific invoice or find it in the new list
        // Since loadData updates the list, we can just close/re-open or rely on finding it
        // Simpler: just refresh list and close sheet or let user see updated state if we fetched single
        // For now, loadData refreshes list.
        // We should arguably also update the selectedInvoice state from the new list
        startTransition(async () => {
            const res = await getInvoices();
             if (res.status === "success" && res.data) {
                setInvoices(res.data);
                const updated = res.data.find(i => i.id === selectedInvoice.id);
                if (updated) setSelectedInvoice(updated);
             }
             const mRes = await getBillingMetrics();
             if (mRes.status === "success" && mRes.data) setMetrics(mRes.data);
        })
    }
  };

  return (
    <PageShell>
      <PageHeader>
        <h1 className="text-2xl font-bold tracking-tight">Quản lý hóa đơn</h1>
      </PageHeader>

      <PageContent>
        {/* Metrics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                <DollarSign className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                {metrics
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(metrics.totalRevenue)
                    : "..."}
                </div>
            </CardContent>
            </Card>
            <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chờ thanh toán</CardTitle>
                <AlertCircle className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                {metrics
                    ? new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(metrics.pendingAmount)
                    : "..."}
                </div>
            </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Đã thanh toán</CardTitle>
                    <CheckCircle className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                        {metrics?.paidInvoices ?? "..."}
                    </div>
                    <p className="text-xs text-muted-foreground">hóa đơn</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Chưa thanh toán</CardTitle>
                    <FileText className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                        {metrics?.unpaidInvoices ?? "..."}
                    </div>
                    <p className="text-xs text-muted-foreground">hóa đơn</p>
                </CardContent>
            </Card>
        </div>

        {/* Main Table Area */}
        <SurfaceCard>
            <InvoiceTable
                data={invoices}
                onView={handleViewInvoice}
                isLoading={isPending && invoices.length === 0}
            />
        </SurfaceCard>

        <InvoiceSheet
            invoice={selectedInvoice}
            open={isSheetOpen}
            onOpenChange={setIsSheetOpen}
            onUpdate={handleUpdate}
        />
      </PageContent>
    </PageShell>
  );
}
