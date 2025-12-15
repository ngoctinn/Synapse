import { Badge } from "@/shared/ui/badge";
import { Separator } from "@/shared/ui/separator";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { PAYMENT_METHOD_LABELS } from "../../constants";
import { Invoice } from "../../types";
import { InvoiceStatusBadge } from "../invoice-status-badge";

interface InvoiceDetailsProps {
  invoice: Invoice;
}

export function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
      amount
    );

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Mã hóa đơn</p>
          <p className="font-medium">{invoice.id}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Ngày tạo</p>
          <p className="font-medium">
            {format(invoice.issuedAt, "dd/MM/yyyy HH:mm", { locale: vi })}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Khách hàng</p>
          <p className="font-medium">{invoice.customerName}</p>
          <p className="text-muted-foreground text-xs">{invoice.customerPhone}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Trạng thái</p>
          <InvoiceStatusBadge status={invoice.status} />
        </div>
      </div>

      <Separator />

      {/* Items List */}
      <div className="space-y-4">
        <h4 className="font-semibold text-sm">Chi tiết dịch vụ & sản phẩm</h4>
        <div className="border rounded-md divide-y">
          {invoice.items.map((item) => (
            <div key={item.id} className="p-3 flex justify-between items-start text-sm">
              <div>
                <p className="font-medium">{item.serviceName || item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} x {formatCurrency(item.unitPrice)}
                </p>
              </div>
              <p className="font-medium">{formatCurrency(item.totalPrice)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tổng tiền hàng:</span>
          <span>{formatCurrency(invoice.amount)}</span>
        </div>
        {invoice.discountAmount && invoice.discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Giảm giá ({invoice.discountReason}):</span>
            <span>-{formatCurrency(invoice.discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-lg pt-2 border-t">
          <span>Thành tiền:</span>
          <span>{formatCurrency(invoice.finalAmount)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Đã thanh toán:</span>
          <span>{formatCurrency(invoice.paidAmount)}</span>
        </div>
        <div className="flex justify-between text-orange-600 font-medium">
          <span>Còn lại:</span>
          <span>{formatCurrency(invoice.finalAmount - invoice.paidAmount)}</span>
        </div>
      </div>

      <Separator />

      {/* Payment History */}
      {invoice.payments && invoice.payments.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Lịch sử thanh toán</h4>
          <div className="space-y-2">
            {invoice.payments.map((payment) => (
              <div
                key={payment.id}
                className="bg-muted/30 p-2 rounded text-sm flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {formatCurrency(payment.amount)}
                    </span>
                    <Badge variant="outline" size="xs">
                      {PAYMENT_METHOD_LABELS[payment.method]}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground">
                    {format(payment.transactionTime, "dd/MM/yyyy HH:mm", {
                      locale: vi,
                    })}
                  </p>
                </div>
                {payment.note && (
                   <span className="text-xs text-muted-foreground max-w-[100px] truncate" title={payment.note}>
                      {payment.note}
                   </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
