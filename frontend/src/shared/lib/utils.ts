import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

export function formatCurrency(amount: number): string {
  return currencyFormatter.format(amount);
}

/**
 * Định dạng ngày theo chuẩn Việt Nam (DD/MM/YYYY)
 */
export function formatDate(date: Date | string | number): string {
  if (!date) return "--";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "--";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/**
 * Định dạng ngày giờ theo chuẩn Việt Nam (HH:mm DD/MM/YYYY)
 */
export function formatDateTime(date: Date | string | number): string {
  if (!date) return "--";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "--";
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour12: false,
  })
    .format(d)
    .replace(",", "");
}

/**
 * Định dạng giờ theo chuẩn Việt Nam (HH:mm)
 */
export function formatTime(date: Date | string | number): string {
  if (!date) return "--";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "--";
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

/**
 * Định dạng số phút sang chuỗi "X giờ Y phút" hoặc "X phút" gọn gàng.
 * Ví dụ: 60 -> "1 giờ", 75 -> "1 giờ 15 phút", 45 -> "45 phút"
 */
export function formatDuration(minutes: number | string): string {
  const minsNum = typeof minutes === "string" ? parseInt(minutes, 10) : minutes;
  if (isNaN(minsNum) || minsNum === 0) return "0 phút";

  const hours = Math.floor(minsNum / 60);
  const remainingMins = minsNum % 60;

  if (hours === 0) return `${remainingMins} phút`;
  if (remainingMins === 0) return `${hours} giờ`;
  return `${hours} giờ ${remainingMins} phút`;
}

export function toCamelCase(obj: unknown): unknown {
  const seen = new WeakSet();

  const convert = (value: unknown): unknown => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return value; // Return original value if circular reference detected
      }
      seen.add(value);
    }

    if (Array.isArray(value)) {
      return value.map((v) => convert(v));
    } else if (value !== null && typeof value === "object") {
      return Object.keys(value).reduce(
        (result, key) => {
          const newKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
          return {
            ...result,
            [newKey]: convert((value as Record<string, unknown>)[key]),
          };
        },
        {} as Record<string, unknown>
      );
    }
    return value;
  };

  return convert(obj);
}

export function toSnakeCase(obj: unknown): unknown {
  const seen = new WeakSet();

  const convert = (value: unknown): unknown => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return value; // Return original value if circular reference detected
      }
      seen.add(value);
    }

    if (Array.isArray(value)) {
      return value.map((v) => convert(v));
    } else if (value !== null && typeof value === "object") {
      return Object.keys(value).reduce(
        (result, key) => {
          const newKey = key.replace(
            /[A-Z]/g,
            (letter) => `_${letter.toLowerCase()}`
          );
          return {
            ...result,
            [newKey]: convert((value as Record<string, unknown>)[key]),
          };
        },
        {} as Record<string, unknown>
      );
    }
    return value;
  };

  return convert(obj);
}

export function capitalize(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}
