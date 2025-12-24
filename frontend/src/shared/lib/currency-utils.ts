/**
 * Currency Utilities
 * Fix Issue #32: Currency Formatting với Locale Support
 */

export type LocaleCode = "vi-VN" | "en-US" | "ja-JP";
export type CurrencyCode = "VND" | "USD" | "JPY";

interface FormatCurrencyOptions {
  /** Locale code, default: vi-VN */
  locale?: LocaleCode;
  /** Currency code, default: VND */
  currency?: CurrencyCode;
  /** Show currency symbol, default: true */
  showSymbol?: boolean;
  /** Compact notation for large numbers (1K, 1M), default: false */
  compact?: boolean;
}

/**
 * Format currency với locale support
 *
 * @example
 * formatCurrency(1000000) // "1.000.000 ₫"
 * formatCurrency(1000000, { compact: true }) // "1 Tr"
 * formatCurrency(1000000, { locale: 'en-US', currency: 'USD' }) // "$1,000,000"
 */
export function formatCurrency(
  amount: number | null | undefined,
  options: FormatCurrencyOptions = {}
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "--";
  }

  const {
    locale = "vi-VN",
    currency = "VND",
    showSymbol = true,
    compact = false,
  } = options;

  // Compact format cho số lớn (chỉ VND)
  if (compact && currency === "VND") {
    if (amount >= 1_000_000_000) {
      return `${(amount / 1_000_000_000).toFixed(1)} Tỷ`;
    }
    if (amount >= 1_000_000) {
      return `${(amount / 1_000_000).toFixed(1)} Tr`;
    }
    if (amount >= 1_000) {
      return `${(amount / 1_000).toFixed(0)} K`;
    }
  }

  // Standard format
  const formatter = new Intl.NumberFormat(locale, {
    style: showSymbol ? "currency" : "decimal",
    currency: showSymbol ? currency : undefined,
    minimumFractionDigits: currency === "VND" ? 0 : 2,
    maximumFractionDigits: currency === "VND" ? 0 : 2,
  });

  return formatter.format(amount);
}

/**
 * Parse currency string về number
 * Handle cả VND format (1.000.000) và US format (1,000,000)
 */
export function parseCurrency(value: string): number {
  if (!value) return 0;

  // Remove all non-numeric characters except dots and commas
  const cleaned = value.replace(/[^\d.,]/g, "");

  // Detect format: VND uses dot as thousand separator
  const hasDot = cleaned.includes(".");
  const hasComma = cleaned.includes(",");

  let normalized: string;

  if (hasDot && hasComma) {
    // Ambiguous: assume VND format (dots for thousands, comma for decimals)
    normalized = cleaned.replace(/\./g, "").replace(",", ".");
  } else if (hasDot) {
    // Could be VND thousands or US decimals
    // Check if last segment is 3 digits (thousands) or not (decimals)
    const parts = cleaned.split(".");
    if (parts[parts.length - 1].length === 3 && parts.length > 1) {
      // VND format
      normalized = cleaned.replace(/\./g, "");
    } else {
      // US decimal format
      normalized = cleaned;
    }
  } else if (hasComma) {
    // US format with comma as thousands
    normalized = cleaned.replace(/,/g, "");
  } else {
    normalized = cleaned;
  }

  return parseFloat(normalized) || 0;
}

/**
 * Calculate percentage of payment
 */
export function calculatePaymentPercentage(
  paidAmount: number,
  totalAmount: number
): number {
  if (totalAmount === 0) return 0;
  return Math.round((paidAmount / totalAmount) * 100);
}

/**
 * Get payment status color based on amount paid
 * Fix Issue #33: Payment States
 */
export function getPaymentStatusColor(
  paidAmount: number,
  totalAmount: number
): "destructive" | "warning" | "success" | "info" {
  const percentage = calculatePaymentPercentage(paidAmount, totalAmount);

  if (percentage === 0) return "destructive"; // Chưa thanh toán
  if (percentage < 100) return "warning";     // Thanh toán 1 phần
  if (percentage === 100) return "success";   // Thanh toán đủ
  return "info";                              // Thanh toán thừa
}

/**
 * Format payment status text
 */
export function getPaymentStatusText(
  paidAmount: number,
  totalAmount: number
): string {
  const percentage = calculatePaymentPercentage(paidAmount, totalAmount);

  if (percentage === 0) return "Chưa thanh toán";
  if (percentage < 100) return `Đã thanh toán ${percentage}%`;
  if (percentage === 100) return "Đã thanh toán đủ";
  return `Đã thanh toán thừa ${formatCurrency(paidAmount - totalAmount)}`;
}
