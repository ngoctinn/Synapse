"use client";

import {
  PageContent,
  PageHeader,
  PageShell,
  SurfaceCard,
} from "@/shared/components/layout/page-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { AlertCircle, CheckCircle, DollarSign, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/shared/lib/utils";
import { Invoice, InvoiceStatus } from "../model/types";
import { InvoiceTable } from "./invoice-table";
import { InvoiceSheet } from "./sheet/invoice-sheet";
import { useBillingStore } from "../hooks/use-billing-store";

export function BillingPage() {
  const {
    invoices,
    metrics,
    isLoading,
    loadAllData,
    fetchInvoices,
    fetchMetrics,
  } = useBillingStore();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsSheetOpen(true);
  };

  const handleUpdate = () => {
    fetchInvoices(
      filterStatus !== "all"
        ? { status: [filterStatus as InvoiceStatus] }
        : undefined
    );
    fetchMetrics();
    if (selectedInvoice) {
      // Refresh detail if needed
    }
  };

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    fetchInvoices(
      value !== "all" ? { status: [value as InvoiceStatus] } : undefined
    );
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
              <CardTitle className="text-sm font-medium">
                Tổng doanh thu
              </CardTitle>
              <DollarSign className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics ? formatCurrency(metrics.totalRevenue) : "..."}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Chờ thanh toán
              </CardTitle>
              <AlertCircle className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {metrics ? formatCurrency(metrics.pendingAmount) : "..."}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Đã thanh toán
              </CardTitle>
              <CheckCircle className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {metrics?.paidInvoices ?? "..."}
              </div>
              <p className="text-muted-foreground text-xs">hóa đơn</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Chưa thanh toán
              </CardTitle>
              <FileText className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {metrics?.unpaidInvoices ?? "..."}
              </div>
              <p className="text-muted-foreground text-xs">hóa đơn</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Toolbar */}
        <div className="mb-4 flex items-center justify-between">
          <Tabs
            value={filterStatus}
            onValueChange={handleFilterChange}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="PAID">Đã thanh toán</TabsTrigger>
              <TabsTrigger value="UNPAID">Chờ thanh toán</TabsTrigger>
              <TabsTrigger value="OVERDUE">Quá hạn</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Main Table Area */}
        <SurfaceCard>
          <InvoiceTable
            data={invoices}
            onView={handleViewInvoice}
            isLoading={isLoading}
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
